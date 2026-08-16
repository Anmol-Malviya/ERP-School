const levels = ['debug','info','warn','error'];
const logger = Object.fromEntries(levels.map(level => [level, (...args) => {
  if (process.env.NODE_ENV === 'test' && level !== 'error') return;
  const fn = level === 'debug' ? console.debug : console[level] || console.log;
  fn(`[${new Date().toISOString()}] [${level.toUpperCase()}]`, ...args);
}]));
module.exports = logger;
