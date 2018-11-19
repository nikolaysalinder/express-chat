const mongoose = require('mongoose');
const config = require('config');

const url = config.get('db.url');
const options = config.get('db.options');


mongoose.set('debug', true);

mongoose.connect(url, options).catch();

module.exports = mongoose;
