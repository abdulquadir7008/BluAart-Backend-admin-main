const fs = require('fs');
const readline = require('readline');
const winston = require('winston');

const logFile = './logs/bluartadmin-out.log'; 
const logger = winston.createLogger({
  level: 'info', // Adjust the log level as needed
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pm2-logs.log' }),
  ],
});


const rl = readline.createInterface({
  input: fs.createReadStream(logFile),
});


rl.on('line', (line) => {
    console.log('Read line:', line);

  logger.info(line);
});

console.log("fgfdfd")
