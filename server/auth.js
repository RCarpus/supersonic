const jwtSecret = process.env.JWT_SECRET; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // My local passport file, not the package


let generateJWTToken = (user) => {
  /**
   * I only want to encode the username and _id because
   * If I encode the whole user data, the JWT will get very large and will stop working.
   */
  let encodedData = {
    Username: user.Username,
    _id: user._id,
  };
  return jwt.sign(encodedData, jwtSecret, {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}

/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        // I want to exclude the practice data from the return object
        let trimmedUser = {
          _id: user._id,
          Username: user.Username,
          Email: user.Email,
        }
        return res.json({ user : trimmedUser, token });
      });
    })(req, res);
  });
}