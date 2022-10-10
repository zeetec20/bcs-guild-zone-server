const {body} = require('express-validator')
const errorValidateHandler = require('./errorValidateHandler')

module.exports = [
    body('name').notEmpty().isString(),
    body('email').notEmpty().isEmail().toLowerCase(),
    body('password').notEmpty().isLength({min: 8}),
    errorValidateHandler
]