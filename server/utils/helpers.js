// server/utils/helpers.js
function safeJsonParse(value, defaultValue = []) {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

module.exports = {
  safeJsonParse
};