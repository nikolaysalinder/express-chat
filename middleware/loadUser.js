const { User } = require('../models/user');

module.exports = (req, res, next) => {
  req.user = res.locals.user = null;

  if (!req.session.user) return next();
  console.log(req.session.user, 'req.session.user');
  User.findById(req.session.user, (err, user) => {
    if (err) return next(err);

    req.user = res.locals.user = user;
    return next();
  });
};
