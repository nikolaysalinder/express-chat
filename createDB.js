const mongoose = require('./libs/mongoose');

async function open() {
  return new Promise((resolve) => {
    mongoose.connection.on('open', resolve);
  });
}

async function dropDatabase() {
  const db = mongoose.connection;
  return db.dropDatabase(() => {
    console.log('dropped');
  });
}

function requireModels() {
  // eslint-disable-next-line
  require('./models/user');

  const keys = Object.keys(mongoose.models);
  const promises = keys.map(key => mongoose.models[key].ensureIndexes());

  return Promise.all(promises);
}

function createUsers() {
  const users = [
    { username: 'Vasya', password: 'supervasya' },
    { username: 'Petya', password: 'superpetya' },
    { username: 'admin', password: 'superadmin' },
  ];

  const promises = users.map((userData) => {
    const user = new mongoose.models.User(userData);
    return user.save();
  });

  return Promise.all(promises);
}

(async () => {
  try {
    await open();
    await dropDatabase();
    await requireModels();
    await createUsers();

    mongoose.disconnect();
  } catch (err) {
    console.log(err);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
  }
})();
