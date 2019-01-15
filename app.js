// Load packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _ = require("lodash");
var jwt    = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var request = require('request');
var bcrypt = require('bcrypt');
var compression = require('compression');
var helmet = require('helmet');
var pgp = require('pg-promise')();

// Define express app
var app = express();

// Use compression and helmet middleware for protection in production
app.use(compression());
app.use(helmet());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/main/*', function(req, res){
  res.sendfile(__dirname + '/client/build/index.html');
});

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
var runs  = require('./routes/runs');
var runs2 = require('./routes/runs2');
var runs3 = require('./routes/runs3');

// Set routing for local entries
app.use('/', index);
app.use('/api/runs', runs);
app.use('/api/runs2', runs2);
app.use('/api/runs3', runs3);


// Load secure variables from environment (must run "source app-env" in console before running)
var db_type        = process.env.DB_TYPE;
var db_user        = process.env.DB_USER;
var db_pass        = process.env.DB_PASS;
var db_server      = process.env.DB_SERVER;
var db_port        = process.env.DB_PORT;
var db_name        = process.env.DB_NAME;
var jwt_init       = process.env.JWT_INIT;
var rapidpro_token = process.env.RAPIDPRO_TOKEN;
var rapidpro_url   = process.env.RAPIDPRO_URL;
var salt_rounds    = parseInt(process.env.SALT_ROUNDS);

// Connect to PostgreSQL database
var url = db_type+'://'+db_user+':'+db_pass+'@'+db_server+':'+db_port+'/'+db_name
var db = pgp(url)

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

  db.any('SELECT * FROM users WHERE username = ${username}', {
    username: jwt_payload.username
  })

    .then(function (results) {
      next(null, results);
    })

    .catch(function (error) {
      next(null, false);
    }
  )
});
passport.use(strategy);

// Check if user is authorized given their username and password
app.post("/auth", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  // Query for all users
  db.any('SELECT * FROM users')
    
    // If query successful, check if username and password are in database.
    .then(function (results) {
      var success = false
      var user;
      for (idx in results) {
        user = results[idx]
        checkName = (username === user.username)
        checkPass = bcrypt.compareSync(password, user.password)
        if (checkName & checkPass) {
          success = true
          break
        }
      }

      // If not in database, return 400 error
      if (!success) {
        res.status(400).json({message: "Unsuccessful verification"});

      // If in database, return token to be stored in LocalStorage
      } else {
        var payload = {username: user.username};
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({message: "ok", token: token});
      }
    })
    
    // If query unsuccessful, return error
    .catch(function (error) {
      res.status(401).json({message: "Unsuccessful verification"});
    })
  }
)

// Setup request to check credentials
app.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json("ok");
});

// Define RapidPro query headers
var headers = {
  'Authorization': rapidpro_token,
  'Cache-Control': 'no-cache'
}

// Get all contacts from PostgreSQL
app.get("/api/getAllContacts", passport.authenticate('jwt', { session: false }), function(req, res) {

  // Query for all contacts
  db.any('SELECT * FROM contacts')

    // If query successful, check if contacts are returned
    .then(function (results) {

      // If no contacts are found, return error
      if (results.length === 0) {
        res.status(400).json({Message: 'No contacts found.'})

      // If contacts are found, return list of contacts
      } else {
        res.status(200).json(results)
      }
    })

    // If query successful, return error
    .catch(function (error) {
      res.status(401).json({message: "No contacts found."});
    })
});

// Get contact by phone number from PostgreSQL
app.get("/api/getContact", passport.authenticate('jwt', { session: false }), function(req, res) {

  // Search for contacts matching queried phone number
  db.any('SELECT * FROM contacts WHERE phone = ${phone}', {
    phone: req.query.phone
  })

    // If query successful, check whether there is a match
    .then(function (results) {

      // If no match is found, return error
      if (results.length === 0) {
        res.status(400).json({Message: 'No match found for queried phone number'})

      // If match is found, return contact information
      } else {
        res.status(200).json(results)
      }
    })

    // If query successful, return error
    .catch(function (error) {
      res.status(401).json({Message: 'No match found for queried phone number'})
    })

  });

// Use phone number to query RapidPro for symptom data
app.get("/api/runsByPhone", 
  passport.authenticate('jwt', { session: false }),
  function(req,res,next) {
    var options = {
      url: rapidpro_url + '/contacts.json?urn=' + req.query.urn,
      headers: headers
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.locals.uuid = body.results[0].uuid
      } else {
        res.status(401).send('No contact found with sent phone number.')
      }
    })
  },
  function(req,res,next) {
    var options = {
      url: rapidpro_url + '/runs.json?contact=' + res.locals.uuid + '&after=' + req.query.after,
      headers: headers
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.status(200).send(body)
      } else {
        res.status(401).send('No symptoms found with UUID.')
      }
    })
  }
);

// Create GET request to update notes in PostgreSQL
app.get('/api/getNotes', passport.authenticate('jwt', { session: false }), function(req, res){
  
  // Search for notes matching queried phone number
  db.any('SELECT * FROM notes WHERE phone = ${phone}', {
    phone: req.query.phone
  })

    // If query successful, check whether note were found.
    .then(function (results) {
      
      // If no notes found, return error
      if (results.length === 0) {
        res.status(400).json({Message: 'No notes found'})

      // If note found, return notes
      } else {
        res.status(200).json(results)
      }
    })

    // If query unsuccessful, return error
    .catch(function (error) {
      res.status(401).json({Message: 'No notes found'})
    })
});

// Create POST request to update notes in PostgreSQL
app.post('/api/saveNote', passport.authenticate('jwt', { session: false }), function(req, res){

  // Search to see if any notes exist for patient
  db.any('SELECT * FROM notes WHERE phone = ${phone} AND date = ${date}', {
    phone: req.body.phone,
    date: req.body.date
  })

    // If query successful, check whether note exists for given day and phone
    .then(function (results) {
      
      // If note doesn't exist for given day and phone, simply insert
      if (results.length === 0) {
        db.none('INSERT INTO notes VALUES (${phone},${date},${note},${author},${timestamp})', {
          phone: req.body.phone,
          date: req.body.date,
          note: req.body.note,
          author: req.body.author,
          timestamp: req.body.timestamp
        })

          // If inserted, send confirmation
          .then(() => {
            res.status(200).send('Saved notes to database')
          })

          // If not inserted, send error
          .catch(error => {
            console.log(error)
            res.status(400).send('Notes not saved to database')
          });

      // If note does exist, only update
      } else {

        // If empty string, delete note
        if (req.body.note === "") {
          db.none('DELETE FROM notes WHERE phone = ${phone} AND date = ${date}',{
            phone: req.body.phone,
            date: req.body.date
          })
            
            // If delete successful, send confirmation
            .then(() => {
              res.status(200).send('Deleted note from database')
            })

            // If delete unsuccessful, send error
            .catch(error => {
              console.log(error)
              res.status(400).send('Note not deleted to database')
            });

        // If not empty, save update
        } else {
          db.none('UPDATE notes SET note = ${note}, author = ${author}, timestamp = ${timestamp} WHERE phone = ${phone} AND date = ${date}', {
            note: req.body.note,
            author: req.body.author,
            timestamp: req.body.timestamp,
            phone: req.body.phone,
            date: req.body.date
          })
            
            // If update successful, send confirmation
            .then(() => {
              res.status(200).send('Saved notes to database')
            })

            // If updated unsuccessful, send error
            .catch(error => {
              console.log(error)
              res.status(400).send('Notes not saved to database')
            });
          }
        }
      }
    )

    // If query unsuccessful, return error
    .catch(function (error) {
      res.status(401).send('Notes not saved to database')
    })
  }
);

// Create POST request to create new patient in PostgreSQL
app.post('/api/createPat', passport.authenticate('jwt', { session: false }), function(req, res){
  
  // Search to see if a contact exists with the provided phone number
  db.any('SELECT * FROM contacts WHERE phone = ${phone}', {
    phone: req.body.phone,
  })

    // If query successful, check where contact already exists with phone number
    .then(function (results) {

      // If no contact exists with number, add
      if (results.length === 0) {
        db.none('INSERT INTO contacts VALUES (${phone},${surname},${firstname},${language},${sex},${dob},${registered_on},${registered_by})', {
          phone: req.body.phone,
          surname: req.body.surname,
          firstname: req.body.firstname,
          language: req.body.language,
          sex: req.body.sex,
          dob: req.body.dob,
          registered_on: req.body.registered_on,
          registered_by: req.body.registered_by
        })

          // If add successful, send confirmation
          .then(() => {
            res.status(200).send('Saved contact to database')
          })

          // If add unsuccessful, send error
          .catch(error => {
            console.log(error)
            res.status(400).send('Contact not saved to database')
          });

      // If contact exists with number, send error
      } else {
        res.status(400).send('Contact exists with provided phone number.');
      }
    })

    // If query unsuccessful, send error
    .catch(function (error) {
      console.log(error)
      res.status(401).send('Notes not saved to database')
    });
  }
);

// Create POST request to create new clinician in PostgreSQL
app.post('/api/createClin', passport.authenticate('jwt', { session: false }), function(req, res){

  // Search to see if a user exists with the provided username
  db.any('SELECT * FROM users WHERE username = ${username}', {
    username: req.body.username
  })

    // If query successful, check wither user exists with provided username
    .then(function (results) {

      // If no user exists with username, add
      if (results.length === 0) {
        db.none('INSERT INTO users VALUES (${username},${password},${created_on})', {
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, salt_rounds),
          created_on: req.body.created_on
        })

          // If add successful, send confirmation
          .then(() => {
            res.status(200).send('Saved user to database')
          })

          // If add unsuccesful, send error
          .catch(error => {
            console.log(error)
            res.status(400).send('User not saved to database')
          });

      // If user exists with username, return error
      } else {
        res.status(400).send('User exists with provided username.');
      }
    })

    // If query unsuccessful, return error
    .catch(function (error) {
      console.log(error)
      res.status(401).send('User not saved to database')
    });
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
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