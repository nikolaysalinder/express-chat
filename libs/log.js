const winston = require('winston');
const config = require('config');

const { format } = winston;
const {
  combine, label, colorize, printf,
} = format;


const ENV = config.get('env');

// Задаем формат логирвания для вывода в консоль
const myFormat = printf(info => `${info.level}: [${info.label}] ${info.message}`);

function getLogger(module) {
  const path = module.filename.split('/').slice(-2).join('/');
  const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.Console({
        format: combine(
          label({ label: path }),
          colorize(),
          myFormat,
        ),
        level: ENV === 'development' ? 'debug' : 'error',
      }),
    ],
  });
  return logger;
}

module.exports = getLogger;
