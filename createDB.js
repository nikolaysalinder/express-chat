const mongoose = require('./libs/mongoose');
const log = require('./libs/log')(module);


const { conn } = mongoose.connection;

log.info(conn.readyState);

conn.dropDatabase()
  .then(() => {
    // eslint-disable-next-line
    const { User } = require('./models/user');

    const users = [
      { username: 'Вася', password: 'supervasya' },
      { username: 'Петя', password: '123' },
      { username: 'admin', password: 'thetruehero' },
    ];

    User.ensureIndexes()
      .then(() => {
        User.create(...users, (error, ...users) => {
          if (error) log.debug(error);
          log.info(users);
        })
          .then(() => mongoose.disconnect())
          .catch(err => log.debug(err));
      })
      .catch(err => log.debug(err));
  })
  .catch(err => log.debug(err));
