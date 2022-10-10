/**
 * @param  {string} message
 * @param  {{code, name}} status
 */
module.exports = (message, status) => {
    const err = new Error(message)
    err.name = status.name
    err.code = status.code
    return err
}