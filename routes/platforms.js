const express = require('express');
const platModel =require('../models/platforms');
const router = express.Router();

router.get('/',function (req,res) {
    let query = platModel.find({isUnable:false},['_id','platName','coverImg']).exec(function (err,platList) {
        res.render('platformindex',{platList:platList})
    });
});

module.exports = router;