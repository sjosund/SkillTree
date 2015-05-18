var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var mongo = require("mongodb");
//var monk = require("monk");
//var db = monk('localhost:27017/SkillTree');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/SkillTree');

var Oriento = require('oriento');
var orientdb_server = Oriento({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'larslars'
});
orientdb_server.list()
    .then(function (dbs) {
        console.log('There are ' + dbs.length + ' databases on the server.');
    });
var orient_db = orientdb_server.use('skilltree');

var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

fs.readdirSync(__dirname + '/models').forEach(function (filename) { 
    if (~filename.indexOf('.js')) require(__dirname + "/models/" + filename);
});

app.use(function(req, res, next){
    //req.db = mongoose;
    req.db = orient_db;
    next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
