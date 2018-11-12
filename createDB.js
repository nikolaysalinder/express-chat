const mongoose = require('mongoose');
const config = require('config');
const { format } = require('util');

const user = encodeURIComponent(config.get('db.user'));
const password = encodeURIComponent(config.get('db.password'));

// Connection URL
const url = format(`mongodb://${user}:${password}@localhost:27017/dbName?authSource=admin`);

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;


const Cat = mongoose.model('Cat', { name: String });


const kitty = new Cat({ name: 'Zildjian', test: 5 });
console.log(kitty);
kitty
  .save()
  .then(() => console.log('meow'))
  .then(() => console.log(kitty))
  .then(() => db.close());
