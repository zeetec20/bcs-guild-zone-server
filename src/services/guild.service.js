const storage = require("./storage.service")
const { status } = require("../helpers/response")
const { Guild, Member, Gamer, GuildManager } = require("../models")
const errorWithStatus = require("../helpers/errorWithStatus")
const { getAllGames } = require("./guildZone.service")
const services = require(".")
const { text } = require("express")

/**
 * @param  {string} id
 */
const getGuild = async (id) => {
    const result = await Guild.findById(id)
    if (result == undefined) throw errorWithStatus('guild not found', status.NOT_FOUND)

    const games = await getAllGames()
    const getImages = await Promise.all([storage.get(result.banner), storage.get(result.logo)])
    result.banner = getImages[0]
    result.logo = getImages[1]
    result.games = games.filter(game => result.games.includes(game.id)).map(game => game.toJson())

    return result
}

const joinGuild = async (id, guild, experience, recent_game) => {
    const gamer = await Gamer.findById(id)
    if (gamer == undefined) throw errorWithStatus('gamer is not found', status.NOT_FOUND)
    const guildObj = await Guild.findById(guild)
    if (guildObj == undefined) throw errorWithStatus('guild is not found', status.NOT_FOUND)
    
    const member = new Member({
        name: gamer.name,
        email: gamer.email,
        experience,
        gamer: gamer.id,
        guild,
        recent_game
    })
    await member.save()

    return member
}

const joinGuildAnonnymous = async (guild, name, email, experience, recent_game) => {
    const guildObj = await Guild.findById(guild)
    if (guildObj == undefined) throw errorWithStatus('guild is not found', status.NOT_FOUND)
    
    const member = new Member({
        name: name,
        email: email,
        experience,
        gamer: null,
        guild,
        recent_game
    })
    await member.save()

    return member
}

module.exports = {
    getGuild,
    joinGuild,
    joinGuildAnonnymous
}