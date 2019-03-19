var express = require('express');
//var path = require('path');
var model = require('../models/users');
var router = express.Router();
//var app = express();

// view engine setup
//app.set('views', path.normalize(path.join(__dirname , '../views')));
//app.set('view engine', 'html');
//app.engine('html', require('ejs').__express);

router.get('/login', function (req, res) {
    //res.sendFile(__dirname+'/login.html');
    console.log('hei')
    res.render('login')
    console.log(req.session);
    if (req.session.isLogged === true)
        res.redirect('/');
    else
        res.render('login')
});

router.post('/login', function (req, res) {
    model.findOne({ u_name: req.body.name }, function (err, user) {
        if (err || user.u_psw !== req.body.psw) {
            res.json({ ret_code: 1, ret_msg: '账号或密码错误' });
        } else {
            req.session.userName = req.body.name;
            req.session.isLogged = true;
            res.redirect('/');
        }
    })
});

module.exports=router;