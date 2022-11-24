const router = require('express').Router()
const { guild } = require('../controllers')
const { isAuthenticated } = require('../middlewares')
const { joinGuild, joinGuildAnonymous } = require('../middlewares/validators')

router.post('/guild/:guild/join', isAuthenticated, joinGuild, guild.joinGuild)
router.post('/guild/:guild/join-anonnymous', joinGuildAnonymous, guild.joinGuildAnonymous)
router.get('/guilds/:id', isAuthenticated, guild.getGuild)

module.exports = router