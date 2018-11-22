
module.exports = {
  port: 3000,
  env: 'development',
  db: {
    url: 'mongodb://localhost:27017/chat',
    options: {
      useNewUrlParser: true,
      useCreateIndex: true,
      authSource: 'admin',
      auth: {
        user: 'Kolyan',
        password: 'abc123',
      },
    },
  },
  session: {
    secret: 'My secret',
  },
};
