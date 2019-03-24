var mongoose = require('mongoose');
var testDB = 'mongodb://localhost/myweb';

mongoose.connect(testDB, {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log(err || 'connect news failed');
    } else {
        console.log('connect news succeed');
    }
});

const newsSchema = new mongoose.Schema({
    create_user:        {type: String,  required: true},
    create_date:        {type: Date,    required: true, default: Date.now},
    is_Modified:         {type: Boolean, required: true, default: false},
    last_modified_user: {type: String,  required: true},
    last_modified_date: {type: Date,    required: true, default: Date.now},
    tittle:             {type: String,  required: true},
    classify:           {type: String,  required: true, default: 'default'},
    content:            {type: String,  required: true},
    attachment:         {type: String}
});

module.exports = mongoose.model('News', newsSchema);