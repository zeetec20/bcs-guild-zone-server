const {guildZone} = require('../controllers')
const { validator } = require('../middlewares')
const router = require('express').Router()

router.post('/send-message', validator.sendMessage, guildZone.sendMessage)
router.get('/games', guildZone.games)
router.get('/guilds', guildZone.guilds)

module.exports = router