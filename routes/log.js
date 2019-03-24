const express = require('express');
const users = require('../models/users');
const router = express.Router();

router.get('/', function (req, res) {
    //res.render('home');
    if (req.session.isLogged)
        res.redirect('/');
    else {
        res.redirect('/log/login');
    }
});

router.get('/login', function (req, res) {
    //res.sendFile(__dirname+'/login.html');
    if (req.session.isLogged === true)
        res.redirect('/');
    else
        res.render('login')
});

router.post('/login', function (req, res) {
    users.findOne({u_name: req.body.name}, function (err, user) {
        if (err) {
            res.send(500);
            console.log(err);
        } else if (!user) {
            res.send('用户不存在');
        } else if (user.u_psw !== req.body.psw) {
            res.send(JSON.stringify({ret_code: 1, ret_msg: '账号或密码错误'}));
        } else {
            req.session.userName = req.body.name;
            req.session.isLogged = true;
            res.redirect('/');
        }
    })
});

router.get('/logout', function (req, res) {
    req.session.userName = null;
    req.session.isLogged = false;
    res.redirect('/')
});

router.get('/register', function (req, res) {
    //res.sendFile(__dirname+'/login.html');
    if (req.session.isLogged === true)
        res.redirect('/');
    else
        res.render('register')
});

router.post('/register', function (req, res) {
    //console.log(req.body);
    if (req.session.isLogged === true) {
        res.send(JSON.stringify({ret_msg: "您已登录，请先退出登录"}));
    } else {
        users.findOne({u_name: req.body.name}, function (err, user) {
            if (err || user) {
                res.send(JSON.stringify({ret_msg: "用户已存在"}));
            } else {
                let newUser = new users({
                    u_name: req.body.name,
                    u_psw: req.body.psw
                });
                newUser.save(function (err) {
                    if (err) {
                        res.send(JSON.stringify({ret_msg: "注册失败"}));
                    } else {
                        res.send(JSON.stringify({ret_msg: "注册成功"}));
                        req.session.isLogged = true;
                        req.session.userName = req.body.name;
                        //res.redirect('/');
                    }
                })
            }
        });
    }

});

module.exports = router;

