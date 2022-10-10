const fs = require('fs')
const moment = require('moment')
const morgan = require('morgan')
const { mode } = require('../configs/env')
const utcDate = require('../helpers/utcDate')

const getLog = (console = false, production = false) => morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        `${tokens['response-time'](req, res)} ms`,
        '-',
        moment(utcDate).format()
    ].join(' ')
}, console ? undefined : {
    stream: fs.createWriteStream(production ? 'src/log/production.log' : 'src/log/development.log')
})

const dev = [
    getLog(),
    getLog(true)
]

const pro = getLog(production = true)

module.exports = mode == 'development' ? dev : pro