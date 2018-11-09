const express = require('express');

const app = express();
app.set('port', 3000);

app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));

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
