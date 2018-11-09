const winston = require('winston');
const config = require('config');

const ENV = config.get('env');

function getLogger(module) {
  const path = module.filename.split('/').slice(-2).join('/');
  const logger = winston.createLogger({
    level: 'silly',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
        level: ENV === 'development' ? 'debug' : 'error',
        label: path,
      }),
    ],
  });
  return logger;
}

module.exports = getLogger;


// module.exports = function getLogger(module) {
//   const path = module.filename.split('/').slice(-2).join('/');
//   return new winston.transports.Console({
//     format: winston.format.simple(),
//     colorize: true,
//     level: ENV === 'development' ? 'debug' : 'error',
//     label: path,
//   });
// };

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `combined.log`
//     // - Write all logs error (and below) to `error.log`.
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });
// module.exports = logger;
//
// if (process.env.NODE_ENV !== 'production') {
//   const path = module.filename.split('/').slice(-2).join('/');
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//     colorize: true,
//     level: ENV === 'development' ? 'debug' : 'error',
//     label: path,
//   }));
// }
