const mongoose = require('mongoose');
const testDB = 'mongodb://localhost/myweb';

mongoose.connect(testDB,{useNewUrlParser: true, useFindAndModify: false},function (err) {
    if(err){
        console.log(err||'connect platforms failed');
    }else{
        console.log('connect platforms succeed');
    }
});

/*数据类型：平台
* 平台名称
* 封面图url
* 创建人
* 创建时间
* 最后修改人
* 最后修改时间
*/
const platSchema = new mongoose.Schema({
    MsgType:{type:String,required: true,default:'platMsg'},
    platName:{type: String,required:true},

})