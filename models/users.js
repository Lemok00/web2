var mongoose = require('mongoose');
var testDB = 'mongodb://localhost/myweb';

mongoose.connect(testDB, { useNewUrlParser: true },(err) => {
    if (err) {
        console.log(err ||'connect failed');
    } else {
        console.log('connect succeed');
    }
});

const userSchema = new mongoose.Schema({
    u_name: { type: String, required: true },
    u_psw: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);