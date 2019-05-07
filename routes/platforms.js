const express = require('express');
const platModel = require('../models/platforms');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('platforms/平台1')
});

router.get('/platformlist', function (req, res) {
    let query = platModel.find({isUnable: false}, ['_id', 'platName', 'coverImg','linkedUrl']);
    query.exec(function (err, platList) {
        console.log(platList);
        res.json({data:platList});
    });
});

router.get('/addplatforms', function (req, res) {
    if (req.session.isLogged !== true) {
        res.redirect('/');
    } else {
        res.render('platforms/addplatforms');
    }
});

router.post('/addplatforms', function (req, res) {
    if (req.session.isLogged !== true) {
        res.json({ret_code: 1, ret_msg: '登录失效'});
    } else {
        console.log(req.body);
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

module.exports = router;