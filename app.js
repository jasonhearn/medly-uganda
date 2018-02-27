var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var runs = require('./routes/runs');
var contacts = require('./routes/contacts');
var proxy = require('express-http-proxy');

var app = express();
var basicAuth = require('express-basic-auth')
var jwt    = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var id = "abcd"
  var user = {id: jwt_payload.id};
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

app.use(passport.initialize());
passport.use(strategy);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.get("/", function(req, res) {
  res.json({message: "Express is up!"});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set routing for certain entries
app.use('/', index);
app.use('/users', users);
app.use('/runs', runs);
app.use('/contacts', contacts);

// proxy to textit.in api
app.use('/proxy',proxy('https://api.textit.in', {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['Authorization'] = 'Token f3cfe4509225eea931254f4368cb3ebb003c618e';
    proxyReqOpts.headers['Cache-Control'] = 'no-cache';
    proxyReqOpts.method = 'GET';
    return proxyReqOpts;
  }
}));

var users = [
  {
    id: 1,
    name: 'admin',
    password: 'admin'
  },
  {
    id: 2,
    name: 'ssinabulya',
    password: 'uhi1234'
  }
]

app.post("/auth", function(req, res) {
  if(req.body.name && req.body.password){
    var name = req.body.name;
    var password = req.body.password;
  }
  // usually this would be a database call:
  for (var i = 0; i<users.length; i++) {
    if (name === users[i]['name']) {
      var user = users[i]
      break;
    }
  }
  if( ! user ){
    res.status(401).json({message:"no such user found"});
  }

  if(user.password === req.body.password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

// Test authentication strategy
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("ok");
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
