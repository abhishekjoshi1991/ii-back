const winston = require('winston');
const path = require('path');
const getDateWiseFilename = (prefix) => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); 
  const dd = String(date.getDate()).padStart(2, '0');
  return path.join(__dirname, 'log', `${prefix}-${yyyy}-${mm}-${dd}.log`);;
};

const imaiLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', 
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaString = meta ? JSON.stringify(meta) : '';
        const functionName = meta.functionName ? ` [${meta.functionName}]` : '';
        return `${timestamp} [${level}]${functionName} ${message} ${metaString}`;
      })
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: getDateWiseFilename('error'), level: 'error' }),
      new winston.transports.File({ filename: getDateWiseFilename('combined') }),
    ],
  });
}

module.exports = imaiLogger;