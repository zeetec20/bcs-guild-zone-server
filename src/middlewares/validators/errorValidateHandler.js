const { validationResult } = require("express-validator")
const errorWithStatus = require("../../helpers/errorWithStatus")
const { status } = require("../../helpers/response")

module.exports = (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        const message = [...new Set(err.array().map(err => `${err.param}, ${err.msg}`))].join(' | ')
        next(errorWithStatus(message, status.BAD_REQUEST))
    }
    next()
} 