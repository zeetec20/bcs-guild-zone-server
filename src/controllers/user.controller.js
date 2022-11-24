const services = require('../services')
const response = require('../helpers/response')
const errorWithStatus = require("../helpers/errorWithStatus")
const { Gamer, GuildManager } = require('../models')
const userType = require('../helpers/userType')
const { status } = response

const login = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const token = await services.authentication.login(email, password)
        res.json(response(status.OK, { ...token, token_type: 'Bearer' }))
    } catch (error) {
        if (error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') next(errorWithStatus('email or password is incorrect', status.UNAUTHORIZED))
        next(error)
    }
}

const getUser = async (req, res, next) => {
    const {id} = req.user

    try {
        const user = await services.authentication.user(id)
        res.json(response(status.OK, user.toJson(true)))
    } catch (error) {
        next(error)
    }
}

const guildManagerRegister = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const user = await services.authentication.registerGuildManager(email, password)
        res.json(response(status.OK, user.toJson(true)))
    } catch (error) {
        next(error)
    }
}

const guildManagerCreateGuild = async (req, res, next) => {
    const { name, twitter, telegram, discord, email, games, description, total_member, open_recruitment, region } = req.body
    const { banner, logo } = req.files

    try {
        const guild = await services.guildManager.createGuild(
            req.user.id,
            name,
            { buffer: banner[0].buffer, mimetype: banner[0].mimetype },
            { buffer: logo[0].buffer, mimetype: logo[0].mimetype },
            description,
            region,
            games,
            twitter,
            telegram,
            discord,
            email,
            total_member,
            open_recruitment
        )

        res.json(response(status.OK, guild.toJson(true)))
    } catch (error) {
        next(error)
    }
}

const gamerRegister = async (req, res, next) => {
    const { name, email, password } = req.body

    try {
        const user = await services.authentication.registerGamer(name, email, password)
        res.json(response(status.OK, user.toJson(true)))
    } catch (error) {
        next(error)
    }
}

module.exports = {
    login,
    getUser,
    guildManagerRegister,
    guildManagerCreateGuild,
    gamerRegister
}