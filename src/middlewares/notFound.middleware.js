const { status } = require("../helpers/response")
const responseError = require("../helpers/responseError")

module.exports = (req, res) => res.status(404).json(responseError(status.NOT_FOUND, 'not found'))
