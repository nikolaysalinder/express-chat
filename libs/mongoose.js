const mongoose = require('mongoose');
const config = require('config');

const url = config.get('db.url');
const options = config.get('db.options');

mongoose.set('useFindAndModify', false);
// mongoose.set('debug', true);

mongoose.connect(url, options);

module.exports = mongoose;
