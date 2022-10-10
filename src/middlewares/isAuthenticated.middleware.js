const jwt = require("jsonwebtoken")
const {token_secret} = require('../configs').env
const errorWithStatus = require("../helpers/errorWithStatus")
const { status } = require('../helpers/response')

module.exports = (req, res, next) => {
    let token = req.headers['authorization']
    if (token === undefined) next(errorWithStatus('access token incorrect', status.UNAUTHORIZED))

    token = token.split(' ')[1]
    jwt.verify(token, token_secret, (err, data) => {
        if (err) next(err)
        req.user = data
        next()
    })
}