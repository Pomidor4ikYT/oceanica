// server/utils/logger.js
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(type, message, data = null) {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  
  switch(type) {
    case 'error':
      color = colors.red;
      break;
    case 'success':
      color = colors.green;
      break;
    case 'warning':
      color = colors.yellow;
      break;
    case 'info':
      color = colors.cyan;
      break;
    case 'api':
      color = colors.magenta;
      break;
  }
  
  console.log(`${color}[${timestamp}] [${type.toUpperCase()}] ${message}${colors.reset}`);
  
  if (data) {
    console.log(data);
  }
}

module.exports = {
  log,
  error: (msg, data) => log('error', msg, data),
  success: (msg, data) => log('success', msg, data),
  warning: (msg, data) => log('warning', msg, data),
  info: (msg, data) => log('info', msg, data),
  api: (msg, data) => log('api', msg, data)
};