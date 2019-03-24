const express = require('express');
const newsModel = require('../models/news');
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        res.render('home', {userName: req.session.userName});
    }
    console.log('hello news');
});

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