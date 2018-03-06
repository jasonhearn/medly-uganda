// Load packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var _ = require("lodash");
var jwt    = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var request = require('request');
var MongoClient = require('mongodb').MongoClient

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Setup body and cookie parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load local routes
var index = require('./routes/index');
var users = require('./routes/users');
var runs = require('./routes/runs');
var contacts = require('./routes/contacts');

// Set routing for local entries
app.use('/', index);
app.use('/users', users);
app.use('/runs', runs);
app.use('/contacts', contacts);

// Load secure variables from environment (must run "source app-env")
var db_type = process.env.DB_TYPE;
var db_user = process.env.DB_USER;
var db_pass = process.env.DB_PASS;
var db_server = process.env.DB_SERVER;
var db_port = process.env.DB_PORT;
var db_name = process.env.DB_NAME;
var jwt_init = process.env.JWT_INIT;
var textit_token = process.env.TEXTIT_TOKEN;

// Connect to MongoDB
var url = db_type+'://'+db_user+':'+db_pass+'@'+db_server+':'+db_port+'/'+db_name;
var db;
MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  db = client.db(db_name)
})

// Set parameters for authentication strategy 
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
app.use(passport.initialize());

// Set JWT parameters based on secure token
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = jwt_init;

// Set JWT strategy to take payload as input
var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  var query = {}; query['username'] = jwt_payload.username;
  var user = db.collection('users').find(query)
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
passport.use(strategy);

// Return token with username and password from body
app.post("/auth", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var query = {}; query['username'] = username;
  var user;
  db.collection('users').find(query).toArray(function(err, results) {
    user = results[0]
    if (!user) {
      res.status(401).json({message: "No such user found"});
    } else {
      if (user.password === req.body.password) {
        var payload = {username: user.username};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token: token});
      } else {
        res.status(401).json({message:"passwords did not match"});
      }
    }
  })
});

// Setup request to check credentials
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("ok");
});

// Define query headers
var headers = {
  'Authorization': textit_token,
  'Cache-Control': 'no-cache'
}

// Define TextIt API get requests, requiring authentication through a JWT
app.get("/contByGroup", passport.authenticate('jwt', { session: false }), function(req, res) {
  var options = {
    url: 'https://api.textit.in/api/v2/contacts.json?group=' + req.param('group'),
    headers: headers
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body)
    }
  })
});
app.get("/contByPhone", passport.authenticate('jwt', { session: false }), function(req, res){
  var options = {
    url: 'https://api.textit.in/api/v2/contacts.json?urn=tel:' + req.param('phone'),
    headers: headers
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body)
    }
  })
});
app.get("/contAll", passport.authenticate('jwt', { session: false }), function(req, res){
  var options = {
    url: 'https://api.textit.in/api/v2/contacts.json',
    headers: headers
  }
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body)
    }
  })
});

// Create GET request to update notes in MongoDB
app.get('/getNotes', passport.authenticate('jwt', { session: false }), function(req, res){
  var query = {}; query['phone'] = req.param('phone');
  console.log(query)
  var notes;
  db.collection('notes').find(query).toArray(function(err, results) {
    data = results[0]
    if (!data) {
      console.log('No match')
      res.json({Message: 'No notes found'})
    } else {
      console.log('Match found')
      res.json(data['notes'])
    }
  });
});

// Create POST request to update notes in MongoDB
app.post('/saveNotes', passport.authenticate('jwt', { session: false }), function(req, res){
  var query = {}; query['phone'] = req.body.phone;
  var notes;
  db.collection('notes').find(query).toArray(function(err, results) {
    notes = results[0]
    if (!notes) {
      db.collection('notes').save(req.body, (err, result) => {
        res.send('Saved notes to database')
      })
    } else {
      db.collection('notes').update(query, req.body, (err, result) => {
        res.send('Saved notes to database')
      });
    }
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
