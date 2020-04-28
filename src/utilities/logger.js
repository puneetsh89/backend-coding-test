const winston = require('winston');

require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: `${__dirname}/../../logs/application-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

// options for logger object
const options = {
  appLog: {
    level: 'info',
    filename: `${__dirname}/../../logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    colorize: true,
  },
};

// logger object with above defined options
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.appLog),
    new winston.transports.Console(options.console),
    transport,
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
    winston.format.json(),
  ),
  exitOnError: false,
});

// writing file
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
