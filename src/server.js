const http = require('http')
const app = require('./app')
const { Game } = require('./models')
const { port } = require('./configs').env

const server = http.createServer(app)
server.listen(port, async () => {
    console.log(`Server running at http://127.0.0.1:${port}`)
})