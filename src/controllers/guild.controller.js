const response = require('../helpers/response')
const services = require('../services')

const { status } = response

const joinGuild = async (req, res, next) => {
    const { guild } = req.params
    const { experience, recent_game } = req.body
    const { id } = req.user

    try {
        const ressult = await services.guild.joinGuild(id, guild, experience, recent_game)
        res.json(response(status.OK, ressult.toJson()))
    } catch (error) {
        next(error)
    }
}

const joinGuildAnonymous = async (req, res, next) => {
    const { guild } = req.params
    const { name, email, experience, recent_game } = req.body

    try {
        const ressult = await services.guild.joinGuildAnonnymous(guild, name, email, experience, recent_game)
        res.json(response(status.OK, ressult.toJson()))
    } catch (error) {
        next(error)
    }
}

const getGuild = async (req, res, next) => {
    const { id } = req.params

    try {
        const result = await services.guild.getGuild(id)
        res.json(response(status.OK, result.toJson()))
    } catch (error) {
        next(error)
    }
}

module.exports = {
    joinGuild,
    joinGuildAnonymous,
    getGuild
}