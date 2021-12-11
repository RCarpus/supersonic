// Import dependencies
const express = require('express'),
      morgan = require('morgan'),
      uuid = require('uuid'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      cors = require('cors');;

// functions used for validation prior to sending to server
const { check, validationResult } = require('express-validator');

// initialize express
const app = express();

// import Models here
// ---------------------------------

/* Connect to mongodb */
/* This is an example connection if we are using a locally installed DB */
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
/* This is the line I will use when pushing to the host site */
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
/* This is the connection I will use when developing and using online database */
mongoose.connect('mongodb+srv://user:10cryingPENs@cluster0.yvlij.mongodb.net/supersonic?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

/* CORS configuration. Currently set to allow access from all origings.
  I can change this by uncommenting the code block beneath. */
app.use(cors()); // allows access from all origins
// let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://some-domain.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1){
//       let message = 'The CORS policy for this application doesn\'t allow access from the origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));

/* Logging middleware. I should look into what sort of config options are available that would provide more useful input for me */
app.use(morgan('common'));

// make all files in /public available
app.use(express.static('public'));

/**
 * This is where all of my endpoints will go
 */
app.post('./users/register',
[
  //check with express-validator
  check('Username', 'Username must be alphanumeric').isAlphanumeric(),
  check('Password', 'Password must be at least 8 characters').isLength({ min: 8 }),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  /* If there were validation errors, send that back */
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({ errors: errors.array() });
  }

  /* If there were no errors in the POST format, attempt to register the user */
  let hashedPassword = Users.hashPassword(req.body.Password);
  /* If there is already a user with that username, do not register */
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else { // It is alright to register the user now
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Settings: {
            NoteDuration: 1000,
            SoundWaveType: 'SINE'
          },
          Stats: []
        })
        // send the new user data back in the response
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// endpoint for home page
app.get('/', (req, res) => {
  let responseText = 'This is the API for the Supersonic ear training app, created by Ryan Carpus!';
  res.send(responseText);
});

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('I am afraid something has gone terribly, horribly wrong.');
});

// open server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port 8080.');
});