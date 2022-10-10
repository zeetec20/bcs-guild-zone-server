const router = require('express').Router()
const { user } = require('../controllers')
const { validator, uploadWithoutSave, isAuthenticated } = require('../middlewares')

router.post('/login', validator.login, user.login)
// router.get('/verification/:code')
router.get('/user', isAuthenticated, user.getUser)
router.post('/guild-manager/register', validator.guildManagerRegister, user.guildManagerRegister)
router.post('/guild-manager/create-guild', isAuthenticated, uploadWithoutSave.fields([{ name: 'banner', maxCount: 1 }, { name: 'logo', maxCount: 1 }]), validator.guildManagerCreateGuild, user.guildManagerCreateGuild)
router.post('/gamer/register', validator.gamerRegister, user.gamerRegister)

module.exports = router