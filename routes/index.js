const { ObjectID } = require('mongodb');
const { HttpError } = require('../error');
const { User } = require('../models/user');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.get('/users', (req, res, next) => {
    User.find({}, (err, users) => {
      if (err) next(err);

      res.json(users);
    });
  });

  app.get('/user/:id', (req, res, next) => {
    if (ObjectID.isValid(req.params.id)) {
      User.findById(new ObjectID(req.params.id), (err, user) => {
        if (err) return next(err);
        if (!user) {
          return next(new HttpError(404, 'User not found'));
        }
        return res.json(user);
      });
    } else {
      return next(new HttpError(404, 'Not valid id'));
    }
  });

  app.get('/login', (req, res) => {
    res.render('login');
  });
};
