const express = require('express');
const platModel = require('../models/platforms');
const router = express.Router();

router.get('/', function (req, res) {
    let query = platModel.find({isUnable: false}, ['_id', 'platName', 'coverImg']).exec(function (err, platList) {
        res.render('platforms/平台1', {platList: platList})
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
        res.json({ret_code:0,ret_msg:'增添成功'});
    }
});

module.exports = router;