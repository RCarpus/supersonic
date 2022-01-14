const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Stats: Array
});

/* Function hashes password, used before saving to server */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/* Hashes the input password and compares to the saved hash for the user */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
}

let User = mongoose.model('User', userSchema);

module.exports.User = User;