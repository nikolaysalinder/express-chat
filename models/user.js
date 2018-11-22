const crypto = require('crypto');
const async = require('async');
const util = require('util');
const mongoose = require('../libs/mongoose');


const { Schema } = mongoose;

const schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

schema.methods.encryptPassword = function encryptPassword(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function setHash(password) {
    this.plainPassword = password;
    this.salt = `${Math.random()}`;
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function getHash() { return this.plainPassword; });


schema.methods.checkPassword = function checkPassword(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function authorize(username, password, callback) {
  const User = this;

  async.waterfall([
    function findUser(callback1) {
      User.findOne({ username }, callback1);
    },
    function checkPass(user, callback2) {
      /* eslint-disable */
      if (user) {
        if (user.checkPassword(password)) {
          callback2(null, user);
        } else {
          callback2(new AuthError('Пароль неверен'));
        }
      } else {
        var user = new User({ username, password });
        user.save((err) => {
          if (err) return callback(err);
          callback2(null, user);
          /* eslit-enable */
        });
      }
    },
  ], callback);
};

exports.User = mongoose.model('User', schema);


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
