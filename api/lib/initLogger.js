// Create a logging facility

const winston = require('winston');

const simpleFormat = winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

// TODO: use syslog to log events to SYSLOG_URL
// * https://github.com/winstonjs/winston-syslog
// * https://github.com/lazywithclass/winston-cloudwatch
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        simpleFormat
    ),
    transports: [new winston.transports.Console()]
});

module.exports = logger;
