module.exports = (req, res, next) => {
  res.sendHttpError = (err) => {
    res.status(err.status);
    if (req.xhr) {
      res.json(err);
    } else {
      res.render('error', { error: err });
    }
  };

  return next();
};
