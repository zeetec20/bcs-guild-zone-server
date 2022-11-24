const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const { logging, errorHandler, notFound } = require('./middlewares')

const app = express()
const corsOption = {
    origin: '*'
}

app.use(logging)
app.use(cors(corsOption))
app.use(express.json())
app.use(express.static('src/public'))

app.use(routes.documentations)
app.use(routes.user)
app.use(routes.guild)
app.use(routes.guildZone)

app.use(errorHandler)
// app.use('*', notFound)

module.exports = app