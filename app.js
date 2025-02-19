const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser=require('body-parser');

const indexRouter = require('./routes/index');
const logRouter = require('./routes/log');
const newsRouter = require('./routes/news');
const platRouter = require('./routes/platforms');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'mylog',
    secret: 'secret',
    resave: false,
    saveUnintialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use('/', indexRouter);
app.use('/log',logRouter);
app.use('/news',newsRouter);
app.use('/platforms',platRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    //next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
