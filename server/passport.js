const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/* Authentication strategy for login requests using basic http */
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password'});
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect username or password'});
    }

    console.log('finished logging in.');
    return callback(null, user);
  });
}));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET //This key is used in auth.js
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error);
    });
}));