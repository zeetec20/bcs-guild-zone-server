const {body} = require('express-validator')
const errorValidateHandler = require('./errorValidateHandler')

module.exports = [
    body('experience').notEmpty().isString(),
    body('recent_game').notEmpty().isString(),
    errorValidateHandler
]