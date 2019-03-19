var express = require('express');
var path = require('path');
var model = require('../models/users');
var app = express();

// view engine setup
app.set('views', path.normalize(path.join(__dirname , '../views')));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.get('/', function (req, res) {
    //res.render('home');
    if (req.session.isLogged)
        res.render('home', { userName: req.session.userName });
    else {
        res.redirect('login');
    }
});

app.get('/login', function (req, res) {
    //res.sendFile(__dirname+'/login.html');
    if (req.session.isLogged === true)
        res.redirect('/');
    else
        res.render('trytry')
});

app.post('/login', function (req, res) {
    model.findOne({ u_name: req.body.name }, function (err, user) {
        if (err){
            res.send(500);
            console.log(err);
        } else if(!user){
            res.send('用户不存在');
        } else if(user.u_psw !== req.body.psw) {
            res.json({ ret_code: 1, ret_msg: '账号或密码错误' });
        } else {
            req.session.userName = req.body.name;
            req.session.isLogged = true;
            res.redirect('/');
        }
    })
});

app.get('/logout', function (req, res) {
    req.session.userName = null;
    req.session.isLogged = false;
    res.redirect('/')
});

app.get('/register', function (req, res) {
    //res.sendFile(__dirname+'/login.html');
    if (req.session.isLogged === true)
        res.redirect('/');
    else
        res.render('register')
});

app.post('/register',function (req, res) {
    console.log(req.body);
    if(req.session.isLogged === true){
        res.json({ret_msg : "您已登录，请先退出登录" });
    }else{
        model.findOne({u_name:req.body.name},function (err, user) {
            if(err||user){
                res.json({ret_msg:"用户已存在"});
            }else{
                let newUser = new model({
                    u_name: req.body.name,
                    u_psw: req.body.psw
                });
                newUser.save(function (err) {
                    if(err){
                        res.json({ret_msg:"注册失败"});
                    }else{
                        res.json({ret_msg:"注册成功"});
                        req.session.isLogged=true;
                        req.session.userName=req.body.name;
                        //res.redirect('/');
                    }
                })
            }
        });
    }

});

module.exports = app;

