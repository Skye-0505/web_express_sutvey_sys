var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const dbConfig = require('./config/database');

var app = express();

// 连接 MongoDB
mongoose.connect(dbConfig.local.uri, dbConfig.local.options)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${dbConfig.local.uri}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // 如果数据库连接失败，退出应用
    });

// 监听数据库连接事件
mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose disconnected');
});

// 优雅关闭
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔚 Mongoose connection closed due to app termination');
    process.exit(0);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
const chartsRouter = require('./routes/charts');
app.use('/', indexRouter);
app.use('/chart', chartsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
