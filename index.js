const express = require('express');
const config = require('config');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

// const router = express.Router();
const log = require('./libs/log')(module);


const app = express();
app.set('port', config.get('port'));

app.engine('ejs', require('ejs-locals'));

app.set('views', `${__dirname}/templates`);
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.listen(config.get('port'), () => {
  log.info(`Example app listening on port ${config.get('port')}!`);
});
