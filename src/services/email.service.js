const nodemailer = require('nodemailer')
const {env} = require('../configs')
const errorWithStatus = require('../helpers/errorWithStatus')
const { status } = require('../helpers/response')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.mail_username,
        pass: env.mail_password
    }
})

/**
 * @param  {string} to
 * @param  {string} subject
 * @param  {string} text=null
 * @param  {string} html=null
 */
const sendMail = async (to, subject, text = null, html = null) => {
    if (!text || !html) throw errorWithStatus('Text and html must filled', status.SERVER_ERROR)
    const sendMail = Promise((resolve, reject) => {
        transporter.sendMail({
            from: env.mail_from_name,
            to,
            subject,
            text,
            html
        }, (err, info) => {
            if (err) reject(err)
            resolve(info)
        })
    })
    await sendMail()
}

module.exports = {
    sendMail
}