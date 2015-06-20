var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var url = require('url');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var consumers = require('./routes/consumers');
var shoppers = require('./routes/shoppers');
var shoppingItems = require('./routes/shoppingItems');
var shoppingLists = require('./routes/shoppingLists');
var jobs = require('./routes/jobs');

var User = require('./models/user');
var Session = require('./models/session');

var app = express();

mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
});
mongoose.connect('mongodb://localhost/shoppee_development');

//var u = new User({ isConsumer: true, firstName: "Sasha", lastName: "Varlamov", mail: "Hong Kong", email: "me@me.com"});
//u.save();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', function(req, res, next) {
    var path = url.parse(req.url).pathname;
	console.log("Got a request for, " + path);
    if(path == '/consumers/signin' || path == '/shoppers/signin' || path == '/consumers/signup' || path == '/shoppers/signup'){
        var sessionId = req.body.session;
        if(!sessionId) {
            sessionId = req.query.session;
        }
        if(!sessionId){
            sessionId = req.params.session;
        }
        if(mongoose.Types.ObjectId.isValid(sessionId)){
            Session.findById(sessionId).populate('user').exec(function(err, ses) {
                if (ses) {
                    req['currentUser'] = ses.user;
                    req['sessionId'] = ses._id;
                    res.setHeader('Content-Type', 'application/json');
                    var authObj = { auth: true, session: req.sessionId };
                    res.send(JSON.stringify(authObj));
                    console.log("The current user is, " + req.currentUser);
                    return;
                }
            });
        } else {
            next();
        }
    } else {
        var sessionId = req.body.session;
        if(!sessionId) {
            sessionId = req.query.session;
        }
        if(!sessionId){
            sessionId = req.params.session;
        }
        if(mongoose.Types.ObjectId.isValid(sessionId)){
            Session.findById(sessionId).populate('user').exec(function(err, ses) {
                if (err) {
                    console.error(err);
                    res.status(500);
                    res.send(err);
                } else if (ses) {
                    req['currentUser'] = ses.user;
                    req['sessionId'] = ses._id;
                    console.log("The current user is, " + req.currentUser.email);
                    next();
                } else {
                    failObj = { auth: false, error: sessionId + " session is invalid" };
                    res.status(401);
                    res.send(failObj);
                }
            });
        } else {
            failObj = { auth: false, error: "You must provide a valid session id" };
            res.status(401);
            res.send(failObj)
        }
    }
});

app.use('/', routes);
app.use('/api/v1/consumers', consumers);
app.use('/api/v1/shoppers', shoppers);
app.use('/api/v1/lists', shoppingLists);
app.use('/api/v1/lists/:list_id/items', shoppingItems);
app.use('/api/v1/jobs', jobs);

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