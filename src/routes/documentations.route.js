const fs = require('fs')
const swaggerUI = require('swagger-ui-express')
const router = require('express').Router()

const swaggerDocs = fs.readdirSync('doc/').map(doc => ({
    version: doc.split('_').pop().split('.')[0],
    content: require(`../../doc/${doc}`)
}))

swaggerDocs.forEach(doc => {
    router.use(`/documentations/${doc.version}`, swaggerUI.serve)
    router.get(`/documentations/${doc.version}`, swaggerUI.setup(doc.content))
})

module.exports = router