// Import dependencies
const express = require('express'),
  morgan = require('morgan'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  Models = require('./models.js');


// initialize express and immediately user bodyParser
const app = express();
// import Models here
const Users = Models.User;

// functions used for validation prior to sending to server
const { check, validationResult } = require('express-validator');


/* Connect to mongodb */
/* This is an example connection if we are using a locally installed DB */
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
/* This is the line I will use when pushing to the host site */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
/* This is the connection I will use when developing and using online database */
// mongoose.connect('redacted', { useNewUrlParser: true, useUnifiedTopology: true });

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

app.use(bodyParser.json());

// Imports related to auth
const passport = require('passport');
app.use(passport.initialize());
require('./passport');
let auth = require('./auth')(app);




/* Logging middleware. I should look into what sort of config options are available that would provide more useful input for me */
app.use(morgan('common'));

// make all files in /public available
app.use(express.static('public'));

/**
 * This is where all of my endpoints will go
 */
app.post('/users/register',
  [
    //check with express-validator
    check('Username', 'Username must be alphanumeric').isAlphanumeric(),
    check('Password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    /* If there were validation errors, send that back */
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
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

// endpoint to delete a user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  /**
 * I only want users to be able to access their own data. 
 * To achieve this, I am checking the Username from the user data sent from the
 * JWTStrategy middleware against the username in request.
 * If they don't match, the user is likely malicious,
 * so they should not be able to access the data.
 */
  const loggedInUser = req.user.Username;
  const searchedUser = req.params.Username;
  if (loggedInUser !== searchedUser) return res.status(401).send('Hey, how about you try accessing your own data?');


  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// endpoint to get a specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  /**
   * I only want users to be able to access their own data. 
   * To achieve this, I am checking the Username from the user data sent from the
   * JWTStrategy middleware against the username in request.
   * If they don't match, the user is likely malicious,
   * so they should not be able to access the data.
   */
  const loggedInUser = req.user.Username;
  const searchedUser = req.params.Username;
  if (loggedInUser !== searchedUser) return res.status(401).send('Hey, how about you try accessing your own data?');

  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// endpoint to check if token is valid
app.get('/checktoken', passport.authenticate('jwt', { session: false }), (req, res) => {
  /**
   * The only purpose of this enpoint is to check if a token is still valid. 
   * On the client side, this is used when a logged in user reloads the page to make sure their token hasn't expired.
   */
  res.send('valid');
});


// endpoint to change user info of a specific user
/* Expect Json in this format
{
  Username: String, (optional)
  Password: String, (optional)
  Email: String, (optional)
}
*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  [
    // check for valid inputs using express-validator
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password must be at least 8 characters').optional().isLength({ min: 8 }),
    check('Email', 'Email does not appear to be valid').optional().isEmail()
  ], (req, res) => {
    /**
     * I only want users to be able to access their own data. 
     * To achieve this, I am checking the Username from the user data sent from the
     * JWTStrategy middleware against the username in request.
     * If they don't match, the user is likely malicious,
     * so they should not be able to access the data.
     */
    const loggedInUser = req.user.Username;
    const searchedUser = req.params.Username;
    if (loggedInUser !== searchedUser) return res.status(401).send('Hey, how about you try accessing your own data?');


    // send back list of errors if present, for parameters that were entered
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword;
    if (req.body.Password) {
      hashedPassword = Users.hashPassword(req.body.Password);
    }

    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
      }
    },
      { new: true })
      .then((updatedUserData) => {
        let updatedUser = {
          _id: updatedUserData._id,
          Username: updatedUserData.Username,
          Email: updatedUserData.Email,
        }
        res.status(201).json({ updatedUser });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// endpoint to add a record to a user's records
app.post('/users/:Username/records', passport.authenticate('jwt', { session: false }), (req, res) => {
  /**
 * I only want users to be able to access their own data. 
 * To achieve this, I am checking the Username from the user data sent from the
 * JWTStrategy middleware against the username in request.
 * If they don't match, the user is likely malicious,
 * so they should not be able to access the data.
 */
  const loggedInUser = req.user.Username;
  const searchedUser = req.params.Username;
  if (loggedInUser !== searchedUser) return res.status(401).send('Hey, how about you try accessing your own data?');

  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { Stats: req.body }
  },
    { new: true })
    .then((updatedUser) => {
      res.send('Successfully uploaded practice session.');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// endpoint for home page
app.get('/', (req, res) => {
  let responseText = 'This is the API for the Supersonic ear training app, created by Ryan Carpus! Check out the <a href="https://supersonic-api.herokuapp.com/documentation.html">documentation</a>.';
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