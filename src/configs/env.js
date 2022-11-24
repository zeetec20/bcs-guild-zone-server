const dotenv = require('dotenv')
const mode = process.env.NODE_ENV
dotenv.config({
    path: `.env.${mode == 'test' ? 'development' : process.env.NODE_ENV}`
})

module.exports = {
    domain: process.env.DOMAIN,
    port: process.env.PORT,
    token_secret: process.env.TOKEN_SECRET,
    token_expired: process.env.TOKEN_EXPIRED,
    mode: process.env.NODE_ENV,

    mail_username: process.env.MAIL_USERNAME,
    mail_password: process.env.MAIL_PASSWORD,
    mail_from_name: process.env.MAIL_FROM_NAME,
}