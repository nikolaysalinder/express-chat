const checkAuth = require('../middleware/checkAuth');

module.exports = function getIndexRoutes(app) {
  // eslint-disable-next-line
  app.get('/', require('./frontpage').get);
  // eslint-disable-next-line
  app.get('/login', require('./login').get);
  // eslint-disable-next-line
  app.post('/login', require('./login').post);
  // eslint-disable-next-line
  app.post('/logout', require('./logout').post);
  // eslint-disable-next-line
  app.get('/chat', checkAuth, require('./chat').get);
};
