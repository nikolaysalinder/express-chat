const crypto = require('crypto');

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

exports.User = mongoose.model('User', schema);
