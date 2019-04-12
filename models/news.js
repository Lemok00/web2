var mongoose = require('mongoose');
var testDB = 'mongodb://localhost/myweb';

mongoose.connect(testDB, {useNewUrlParser: true, useFindAndModify: false}, (err) => {
    if (err) {
        console.log(err || 'connect news failed');
    } else {
        console.log('connect news succeed');
    }
});

/*
* 数据类型：新闻
* 创建人
* 创建时间
* 是否修改过
* 最后修改人
* 最后修改时间
* 标题
* 分类
* 内容
* 附件
* */

const newsSchema = new mongoose.Schema({
    MsgType:            {type: String,  required: true, default:'newsMsg'},
    create_user:        {type: String,  required: true},
    create_date:        {type: Date,    required: true, default: Date.now},
    is_Modified:        {type: Boolean, required: true, default: false},
    last_modified_user: {type: String,  required: true},
    last_modified_date: {type: Date,    required: true, default: Date.now},
    tittle:             {type: String,  required: true},
    classify:           {type: String,  required: true, default: 'default'},
    content:            {type: String,  required: true},
    attachment:         {type: String},
    is_Deleted:         {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('News', newsSchema);