const response = require("./response")
const utcDate = require("./utcDate")

/**
 * @param  {{code, status}} status
 * @param  {string} message
 * @param  {string} location=null
 */
module.exports = (status, message, location = null) => response(status, {
    timestamp: utcDate,
    message,
    location
})