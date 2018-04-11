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

// Get all contacts from MongoDB
app.get("/getAllContacts", passport.authenticate('jwt', { session: false }), function(req, res) {
  var query = {};
  db.collection('contacts').find().toArray(function(err, results) {
    if (!results) {
      console.log('No match')
      res.json({Message: 'No notes found'})
    } else {
      console.log('Match found')
      res.json(results)
    }
  });
});

// Get contact by UUID from MongoDB
app.get("/getContact", passport.authenticate('jwt', { session: false }), function(req, res) {
  console.log('UUID: '+req.param('uuid'))
  var query = {}; query['uuid'] = req.param('uuid')
  console.log(query)
  db.collection('contacts').find(query).toArray(function(err, results) {
    if (!results) {
      console.log('No match')
      res.json({Message: 'No notes found'})
    } else {
      console.log('Match found')
      res.json(results)
    }
  });
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
app.get("/runsByUUID", passport.authenticate('jwt', { session: false }), function(req, res){
  var options = {
    url: 'https://api.textit.in/api/v2/runs.json?contact=' + req.param('contact') + '&after=' + req.param('after'),
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
  var query = {}; query['uuid'] = req.param('uuid');
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
app.post('/saveNote', passport.authenticate('jwt', { session: false }), function(req, res){
  var uuid = req.body.uuid; date = req.body.date; 
  console.log(uuid)

  // Define parameters of note to be added (incl. author and timestamp)
  add = {}; 
  add['note'] = req.body.note; 
  add['author'] = req.body.author; 
  add['timestamp'] = req.body.timestamp

  // Query by UUID
  var query = {}; query['uuid'] = uuid;

  // Define note to be added as a sub-field of notes
  var upd = {}; 
  upd['notes.'+date] = add

  // Search to see if any notes exist for patient
  var notes;
  db.collection('notes').find(query).toArray(function(err, results) {
    notes = results[0]

    // If no notes exist, first add initializer and then update with note
    if (!notes) {
      var init = {}, first_note = {}; 
      first_note[date] = add
      init['uuid'] = uuid
      init['notes'] = first_note
      db.collection('notes').save(init)
      db.collection('notes').update(
        query,
        { $set: upd }, 
        (err, result) => {
        res.send('Saved notes to database')
      })

    // If notes do exist, just update
    } else {
      db.collection('notes').update(
        query, 
        { $set: upd }, 
        (err, result) => {
        res.send('Saved notes to database')
      });
    }
  });
});

// Create POST request to create new patient in MongoDB
app.post('/createPat', passport.authenticate('jwt', { session: false }), function(req, res){
  var phone = req.body.phone; 
  var name = req.body.name; 
  var DOB = req.body.DOB; 
  var sex = req.body.sex; 
  var language = req.body.language;
  var registered_on = req.body.registered_on;
  var registered_by = req.body.registered_by;

  // Define parameters of note to be added (incl. author and timestamp)
  add = {}; 
  add['phone'] = phone; 
  add['name'] = name; 
  add['DOB'] = DOB;
  add['sex'] = sex; 
  add['language'] = language;
  add['registered_on'] = registered_on;
  add['registered_by'] = registered_by;

  // Query by UUID
  var query = {}; query['phone'] = phone;

  // Search to see if any notes exist for patient
  var contact;
  db.collection('contacts').find(query).toArray(function(err, results) {
    contact = results[0]

    // If no contact exists at provided phone number, create contact
    if (!contact) {
      db.collection('contacts').save(
        add, 
        (err, result) => {
        res.send('Saved new contact to database')
      })

    // If notes do exist, just update
    } else {
      res.send('Contact already associated with provided phone number')
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
