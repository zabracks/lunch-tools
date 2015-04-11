var nunjucks = require('nunjucks')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// mongo stuff
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/LunchTranslator');

var app = express();

// view engine setup
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){req.db = db;next();});

// routing setup
var homeRoutes = require('./routes/index');
var lunchRoutes = require('./routes/lunches');
var translationRoutes = require('./routes/translations');
var translateRoutes = require('./routes/translate');
app.use('/', homeRoutes);
app.use('/lunches', lunchRoutes);
app.use('/translations', translationRoutes);
app.use('/translate', translateRoutes);

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
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

//browswer-sync for development mode
if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var bs = browserSync(
    {
      proxy: "localhost:3000",
      files: ["public/**", "views/**"],
      reloadDelay: 250,
      logConnections: true
    });
  app.use(require('connect-browser-sync')(bs));
}

module.exports = app;