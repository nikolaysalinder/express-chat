const { User } = require('../models/user');
const log = require('../libs/log')(module);

module.exports = (req, res, next) => {
  req.user = null;
  res.locals.user = null;

  if (!req.session.user) return next();
  log.info(req.session.user, 'req.session.user');
  User.findById(req.session.user, (err, user) => {
    if (err) return next(err);

    req.user = user;
    res.locals.user = user;
    return next();
  });
  return true;
};
