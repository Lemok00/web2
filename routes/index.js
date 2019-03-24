const express = require('express');
const router = express.Router();


router.get('/', function (req, res) {
    //res.render('home');
    if (req.session.isLogged)
        res.render('home', {userName: req.session.userName});
    else {
        res.redirect('/log');
    }
});

module.exports = router;

