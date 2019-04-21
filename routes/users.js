var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = (multer({dest: './uploads'}));
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'Signup'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.getUserByUsername (username, (err, user) => {
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done (null, false, {'message': 'Invalid password'});
      }
    });
  });
}));

//form validator


module.exports = router;
