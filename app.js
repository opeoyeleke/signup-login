var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = (multer({dest: './uploads'}));
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;
var hbs = require('hbs');

var {mongoose} = require('./db/mongoose');
var User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//sessions
app.use(session(
  {
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }
));

//passport-authentication
app.use(passport.initialize());
app.use(passport.session());

//validator



app.use('/users', usersRouter);

app.get('/', (req, res) => {
  res.render('members.hbs');
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs');
});

app.get('/login', (req, res) => {
  res.render('login.hbs');
});

app.post('/signup', upload.single('profileimage'), (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var password = req.body.password;
  var password2 = req.body.password2;

  var newUser = new User ({
    username: username,
    email: email,
    password: password
  });
  
  User.createUser(newUser, function(err, user){
    if (err) throw err;
    console.log(user);
  });
  
  res.redirect('/');
});



app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), (req, res) => {
  res.redirect('/');
});

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
});

module.exports = app;
