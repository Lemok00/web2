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

//新闻列表
//获取最近10条新闻
router.get('/news_list', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        let page = (req.body.page || 1);
        let rows = (req.body.rows || 10); //由请求指定每页新闻的数目
        let query = newsModel.find({});
        query.skip((page - 1) * rows);
        query.limit(rows);  //最多取rows行数据
        query.exec(function (err, newsList) {
            res.render('news_list', {newsList: newsList});
            //console.log(newsList);
        });
    }
});


//发布新闻
router.get('/create_news', function (req, res) {
    //登录状态下才可以发布新闻
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
        //判断是否存在标题重复
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
                //保存新闻
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

router.get('/search_news', function (req, res) {
    //登录状态下才能搜索新闻
    if (req.session.isLogged !== true) {
        res.redirect('/');
        return;
    }
    //获取搜索关键字
    let keyword = req.query.search_keywords;

    //模糊搜索
    //查找标题、内容、分类、发布人、附件包含关键字的新闻
    let _filter = {
        $or: [
            {tittle: {$regex: keyword}},
            {content: {$regex: keyword}},
            {classify: {$regex: keyword}},
            {create_user: {$regex: keyword}},
            {attachment: {$regex: keyword}}
        ]
    };

    //统计满足条件的新闻条数并返回给前端
    let count = 0;
    newsModel.countDocuments(_filter, function (err, news) {
        if (err) {
            console.log(err);
        } else {
            count = news;
        }
    });

    //返回满足条件的新闻数据
    newsModel.find(_filter)
        .limit(10)
        .sort({'id': -1})
        .exec(function (err, news) {
            if (err) {
                console.log(err);
            } else {
                res.send(JSON.stringify({data: news, count: count}));
            }
        })
});

//获取修改请求，返回id符合的新闻数据
router.get('/ask_modify', function (req, res) {
    //登录状态下才可以修改新闻
    if (req.session.isLogged !== true) {
        res.redirect('/');
        return;
    }

    //获取新闻id
    let keyword = req.query.search_keywords;

    //查找一条id符合的新闻
    newsModel.findOne({_id: keyword})
        .exec(function (err, news) {
            //发生错误则返回相应提示
            if (err || !news) {
                res.send('当前新闻不存在');
                return;
            } else {
                //跳转到修改界面
                //传递现有数据
                res.render('news_modify', {
                    id: news._id,
                    tittle: news.tittle,
                    content: news.content,
                    classify: news.classify,
                    attachment: news.attachment
                });
            }
        })
});

//获取修改内容
router.post('/post_modify', function (req, res) {
    //登录状态下才可以提交修改请求
    if (req.session.isLogged !== true) {
        res.redirect('/');
        return;
    }

    //获取要修改的新闻id
    //id在'/ask_modify'时作为隐含数据传出
    let req_id = req.body._id;

    //查找是否存在id匹配的新闻
    newsModel.findOne({_id: req_id}, function (err, news) {
        if (err || !news) {
            //发生错误或新闻不存在时返回错误信息
            res.send('当前新闻不存在');
        }
    });

    //设置修改内容
    //tittle\content\classify\attachment由客户端提交请求
    //新闻是否已修改置为true
    //最后修改人为当前登录用户
    //最后修改时间为当前时间
    //当前时间为标准时间
    let modification = {
        tittle: req.body.tittle,
        content: req.body.content,
        classify: req.body.classify,
        attachment: req.body.attachment,
        is_Modified: true,
        last_modified_date: Date.now(),
        last_modified_user: req.session.userName
    };

    //修改新闻数据
    newsModel.findOneAndUpdate({_id: req_id}, modification, function (err) {
        if (err) {
            //返回错误信息
            res.send('新闻修改失败');
        } else {
            //返回成功信息
            res.send('新闻修改成功')
        }
    });

});

module.exports = router;