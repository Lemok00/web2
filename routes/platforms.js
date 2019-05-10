const express = require('express');
const platModel = require('../models/platforms');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('platforms/platform1')
});

router.get('/platformlist', function (req, res) {
    let query = platModel.find({isUnable: false}, ['_id', 'platName', 'coverImg', 'linkedUrl']);
    query.exec(function (err, platList) {
        //console.log(platList);
        res.json({data: platList, count: platList.length});
    });
});

router.get('/addplatforms', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        res.render('platforms/addplatforms');
    }
});

router.get('/manage_platform', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录失效'});
    } else {
        res.render('platforms/platformlist');
    }
});

router.get('/viewscoverImg', function (req, res) {
    let query = platModel.findOne({_id: req.query.search_keywords}, ['_id', 'coverImg']);
    query.exec(function (err, platform) {
        if (err) {
            console.log(err);
            res.json({ret_code: 1, ret_msg: '数据读取错误'});
        } else {
            res.render('viewImg', {img: platform.coverImg});
        }
    });
});

router.get('/ask_modify', function (req, res) {
    res.render('platforms/modifyplatform');
});

router.get('/askplatforminfo', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录失效'});
    } else {
        let key = req.query.search_keywords;
        let query = platModel.findOne({_id: key}, ['_id', 'platName', 'coverImg', 'linkedUrl']);
        query.exec(function (err, platform) {
            if (err) {
                console.log(err);
                res.json({ret_code: 1, ret_msg: '数据读取错误'});
            } else {
                res.json({ret_code: 0, data: platform});
            }
        })
    }
});

router.post('/addplatforms', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录失效'});
    } else {
        //console.log(req.body);
        let newplatform = new platModel({
            platName: req.body.tittle,
            coverImg: req.body.img,
            linkedUrl: req.body.link,
            create_date: Date.now(),
            create_user: req.session.userName,
            last_modified_user: req.session.userName
        });
        newplatform.save(function (err) {
            if (err) {
                console.log(err);
                res.json({ret_code: 1, ret_msg: '平台增添失败'});
            } else {
                res.json({ret_code: 0, ret_msg: '平台增添成功'});
            }
        });
    }
});

router.post('/postmodify', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录状态失效'});
    } else {
        let _id = req.body._id;
        platModel.findOne({_id: _id}, function (err, platform) {
            if (err || !platform) {
                res.json({ret_code: 1, ret_msg: '该平台不存在'});
            }
        });

        let modification = {
            platName: req.body.tittle,
            linkedUrl: req.body.link,
            coverImg: req.body.img,
            isModified: true,
            last_modified_user: req.session.userName,
            last_modified_date: Date.now()
        };

        platModel.findOneAndUpdate({_id: _id}, modification, function (err) {
            if (err) {
                res.json({ret_code: 1, ret_msg: '平台修改失败'});
            } else {
                res.json({ret_code: 0, ret_msg: '平台修改成功'});
            }
        });
    }
});

router.post('/delete_platform', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录状态失效'});
    } else {
        platModel.findOne({_id: req.body._id}, function (err, platform) {
            if (err || !platform) {
                res.json({ret_code: 1, ret_msg: '当前平台不存在'});
            } else if (platform.isUnable === true) {
                res.json({ret_code: 1, ret_msg: '当前平台已删除'});
            }
        });
        platModel.findByIdAndUpdate(req.body._id, {isUnable: true}, function (err) {
            if (err) {
                res.json({ret_code: 1, ret_msg: '删除失败'});
            } else {
                res.json({ret_code: 0, ret_msg: '删除成功'});
            }
        })
    }
});

module.exports = router;