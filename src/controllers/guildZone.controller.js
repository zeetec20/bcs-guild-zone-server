const { guildZone } = require('../services')
const response = require('../helpers/response')
const { status } = response

const sendMessage = async (req, res, next) => {
    const { name, email, message } = req.body

    try {
        const result = await guildZone.sendMessage(name, email, message)
        res.json(response(status.OK, result.toJson(true)))
    } catch (error) {
        next(error)
    }
}

const games = async (req, res, next) => {
    try {
        const result = await guildZone.getAllGames()
        res.json(response(status.OK, result.map(e => e.toJson(true))))
    } catch (error) {
        next(error)
    }
}

const guilds = async (req, res, next) => {
    try {
        const result = await guildZone.getAllGuilds()
        const guildsJson = result.map(guild => {
            guild.games = guild.games.map(game => game.toJson(true))
            return guild.toJson(true)
        })

        res.json(response(status.OK, guildsJson))
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendMessage,
    games,
    guilds
}