const express = require('express');
const config = require('config');
const log = require('./libs/log')(module);

const app = express();
app.set('port', config.get('port'));

app.listen(config.get('port'), () => log.info(`Example app listening on port ${config.get('port')}!`));

app.use((req, res, next) => {
  if (req.url === '/') res.end('Hello World!');
  else next();
});

app.use((req, res, next) => {
  if (req.url === '/test') res.end('Test');
  else next();
});

app.use((req, res, next) => {
  if (req.url === '/forbidden') next(new Error('Access dined'));
  else next();
});

app.use((req, res) => {
  res.end(404, 'Not found');
});
