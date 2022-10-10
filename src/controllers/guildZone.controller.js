const {guildZone} = require('../services')
const response = require('../helpers/response')
const Game = require('../models/game.model')
const {status} = response

const sendMessage = async (req, res, next) => {
    const {name, email, message} = req.body

    try {
        const result = await guildZone.sendMessage(name, email, message)
        res.json(response(status.OK, result.toJson()))
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
        res.json(response(status.OK, result.map(e => e.toJson(true))))
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendMessage,
    games,
    guilds
}