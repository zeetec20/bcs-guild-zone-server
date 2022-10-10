const { body } = require("express-validator")
const errorValidateHandler = require("./errorValidateHandler");

module.exports = [
    body('name').notEmpty().isString(),
    body('twitter').optional().isString(),
    body('telegram').optional().isString(),
    body('discord').optional().isString(),
    body('email').optional().isString(),
    body('description').notEmpty().isString(),
    body('region').notEmpty().isString(),
    body('games').notEmpty().isString(),
    body('total_member').notEmpty().isDecimal().toInt(),
    body('open_recruitment').notEmpty().isDecimal().toInt(),
    errorValidateHandler
]