const config = require('config');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');

const sessionStore = require('../libs/sessionStore');
const { HttpError } = require('../error');
const log = require('../libs/log')(module);
const { User } = require('../models/user');

const loadUser = session => new Promise((resolve, reject) => {
  if (!session.user) {
    log.err('Session %s is anonymous', session.id);
    reject();
  }

  console.log('retrieving user ', session.user);

  User.findById(session.user).exec((err, user) => {
    if (err) return reject(err);
    if (!user) reject();

    log.debug(`user findbyId result: ${user}`);
    resolve(user);
  });
});

const checkAuth = (handshake, callback) => {
  const handshakeData = cookie.parse(handshake.headers.cookie);
  const sidCookie = handshakeData['connect.sid'];
  const sid = cookieParser.signedCookie(sidCookie, config.get('session.secret'));
  console.log(sid);

  sessionStore.get(sid, (err, session) => {
    log.info(session);

    if (!session) {
      callback(new HttpError(401, 'No session'));
    }

    handshake.session = session;
    handshake.session.sid = sid;

    loadUser(session)
      .then((user) => {
        handshake.user = user;
        console.log(handshake.user);
        callback(null, true);
      })
      .catch((err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(new HttpError(403, 'Anonymous session may not connect'));
      });
  });
};

const socket = (server) => {
  const io = require('socket.io')(server);

  io.use((socket, next) => {
    checkAuth(socket.handshake, (err, success) => {
      if (success) return next();
      next(new HttpError(403, 'Anonymous session may not connect'));
    });
  });

  io.on('session:reload', (sid) => {
    log.debug(`session:reload :${sid}`);
  });

  io.on('sessreload', (sid) => {
    console.log(`sessreload: ${sid}`);
    console.log('io.socket', io.sockets);
    io.sockets.clients((err, clients) => {
      if (err) throw err;

      clients.forEach((clientId) => {
        const client = io.sockets.sockets[clientId];

        if (client.handshake.session.sid !== sid) return;

        sessionStore.get(sid, (err, session) => {
          if (err) {
            client.emit('error', 'server error');
            client.disconnect();
            return;
          }

          if (!session) {
            client.emit('logout');
            client.disconnect();
            return;
          }

          client.handshake.session = session;
        });
      });
    });
  });

  io.on('connection', (socket) => {
    const username = socket.handshake.user.get('username');

    socket.broadcast.emit('join', username);

    socket.on('message', (text, callback) => {
      socket.broadcast.emit('message', username, text);
      callback && callback(text);
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('leave', username);
    });
  });

  return io;
};

module.exports = socket;
