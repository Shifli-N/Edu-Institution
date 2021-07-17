const winston = require('winston');
const {format, transports} = winston;


const myCustomFormat = format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${level.toUpperCase()}]  - ${message}`;
})

const logConfig = {
    
}

const logger = winston.createLogger({
    level : "debug",

    format: format.combine(
        format.timestamp(),
        //format.colorize(),
        myCustomFormat,
    ),

    transports: [
        new transports.Console(),

        new transports.File({
           filename: './.logs/request_logs.log',
        }),
    ]
});


exports.reqLog = (message) => {
    logger.info(message);
}


exports.log = logger;