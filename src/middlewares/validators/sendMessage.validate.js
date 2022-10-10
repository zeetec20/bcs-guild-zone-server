const {body} = require('express-validator')
const errorValidateHandler = require('./errorValidateHandler')

module.exports = [
    body('name').notEmpty().isString(),
    body('email').notEmpty().isEmail().toLowerCase(),
    body('message').notEmpty().isString(),
    errorValidateHandler
]