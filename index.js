const express = require('express');
const config = require('config');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorHandler = require('errorhandler');

// const router = express.Router();
// const { User } = require('./models/user');
const log = require('./libs/log')(module);
const { HttpError } = require('./error');


const app = express();
app.set('port', config.get('port'));

app.engine('ejs', require('ejs-locals'));

app.set('views', `${__dirname}/templates`);
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('./middleware/sendHttpError'));

require('./routes')(app);


app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  if (typeof (err) === 'number') {
    /* eslint-disable-next-line */
    err = new HttpError();
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else if (app.get('env') === 'development') {
    errorHandler()(err, req, res, next);
  } else {
    log.error(err);
    // eslint-disable-next-line
    err = new HttpError(500);
    res.sendHttpError(err);
  }
});
app.use(require('./middleware/sendHttpError'));

app.listen(config.get('port'), () => {
  log.info(`Example app listening on port ${config.get('port')}!`);
});
