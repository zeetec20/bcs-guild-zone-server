const {body} = require('express-validator')
const errorValidateHandler = require('./errorValidateHandler')

module.exports = [
    body('name').notEmpty().isString(),
    body('email').notEmpty().isString().toLowerCase(),
    body('experience').notEmpty().isString(),
    body('recent_game').notEmpty().isString(),
    errorValidateHandler
]