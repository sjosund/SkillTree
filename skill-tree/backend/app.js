var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const graphRouter = require('./routes/graphRouter');
const nodeRouter = require('./routes/nodeRouter');
const edgeRouter = require('./routes/edgeRouter');
const resourceRouter = require('./routes/resourceRouter');
const nodeStatusRouter = require('./routes/nodeStatusRouter');

var app = express();

const url = 'mongodb://localhost:27017/skill-tree';
const connect = mongoose.connect(url);
connect.then((db) => {
    console.log('Connected to MongoDB');
}, (err) => { console.log(err); });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/graph', graphRouter);
app.use('/nodes', nodeRouter);
app.use('/edges', edgeRouter);
app.use('/resources', resourceRouter);
app.use('/nodeStatus', nodeStatusRouter);


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
