const express = require('express');
const newsModel = require('../models/news');
const router = express.Router();
//新闻主页
router.get('/', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        res.render('home', {userName: req.session.userName});
    }
    console.log('hello news');
});

//获取最近10条新闻
router.get('/news_list', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        let page = (req.body.page || 1);
        let rows = (req.body.rows || 10); //由请求指定每页新闻的数目
        let query = newsModel.find({},['_id','tittle','create_date','create_user']);
        query.skip((page - 1) * rows);
        query.limit(rows);  //最多取rows行数据
        query.exec(function (err,newsList) {
            res.render('news_list', {newsList: newsList});
            //console.log(newsList);
        });
    }
});


//发布新闻
router.get('/create_news', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        res.render('create_news');
    }
    //console.log('hello news');
});

router.post('/create_news', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        newsModel.findOne({tittle: req.body.tittle}, function (err, news) {
            if (err || news) {
                res.send(JSON.stringify({ret_mag: '新闻标题重复'}))
            } else {
                let newNews = new newsModel({
                    create_user: req.session.userName,
                    create_date: Date.now(),
                    is_Modified: false,
                    last_modified_user: req.session.userName,
                    last_modified_date: Date.now(),
                    tittle: req.body.tittle,
                    content: req.body.content,
                    classify: 'default'
                });
                newNews.save(function (err) {
                    if (err) {
                        res.send(JSON.stringify({ret_msg: '发布新闻失败'}));
                        //console.log(err);
                    } else {
                        res.send(JSON.stringify({ret_msg: '新闻发布成功'}));
                    }
                });
            }
        })
    }
});

module.exports = router;