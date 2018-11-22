const { HttpError } = require('../error');

module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next(new HttpError(401, 'Вы не авторизованы'));
  }
  return next();
};
