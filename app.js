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

passport.use(strategy);

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

// Define authentication strategy
var basicAuth = basicAuth({
  users: {
    'admin': 'Admin1234',
    'ssinabulya': 'uhi1234'
  }
})
var payload = {name: "abcd"}
var token = jwt.sign(payload, jwtOptions.secretOrKey);

app.get('/auth', basicAuth, function(req, res) {
  res.status(200).json({token: token});
})

// Test authentication strategy
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("Success! You can not see this without a token");
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
