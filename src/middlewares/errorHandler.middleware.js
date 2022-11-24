const { status } = require("../helpers/response")
const responseError = require('../helpers/responseError')

module.exports = (err, req, res, next) => {
    const message = (err.stack == undefined || err.code != 500) ? err.message : {
        message: err.message,
        error: err.stack
    }
    const checkError = (!(err.code != undefined && typeof err.code == 'number' && err.code >= 400 && err.code <= 500) || err.name == undefined)
    const statusRequest = checkError ? status.SERVER_ERROR : { code: err.code, name: err.name }

    const location = () => {
        switch (statusRequest.code) {
            case 400:
                return 'body'
            case 401:
                return 'token'
            case 500:
                return 'server'
            default:
                return null
        }
    }

    if (err) res.status(statusRequest.code).json(responseError(statusRequest, message, location()))
    next()
}