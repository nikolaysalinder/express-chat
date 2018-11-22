const { User } = require('../models/user');
const { HttpError } = require('../error');
const { AuthError } = require('../models/user');

exports.get = (req, res) => {
  res.render('login');
};

exports.post = (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;
  console.log(username, password);

  User.authorize(username, password, (err, user) => {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      }
      return next(err);
    }
    // eslint-disable-next-line
    req.session.user = user._id;
    res.send({});
    return true;
  });
};
