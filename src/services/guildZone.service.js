const { guild } = require('.')
const errorWithStatus = require('../helpers/errorWithStatus')
const { Message, Game, Guild } = require('../models')
const storageService = require('./storage.service')
const { status } = require("../helpers/response")

/**
 * @param  {string} name
 * @param  {string} email
 * @param  {string} message
 */
const sendMessage = async (name, email, message) => {
    const sendMessage = new Message({
        name,
        email,
        message
    })

    await sendMessage.save()
    return sendMessage
}

const getAllGames = async () => {
    const result = await Game.findAll()
    const getImages = {}
    result.forEach(g => {
        getImages[g.id] = g.images.map(image => storageService.get(image))
    })
    let listRequestImages = []
    Object.keys(getImages).forEach(key => {
        listRequestImages = [...listRequestImages, undefined, ...getImages[key]]
    })
    listRequestImages = await Promise.all(listRequestImages)
    const listRequestImagesShort = []
    listRequestImages.forEach(image => {
        if (image == undefined) listRequestImagesShort.push([])
        else listRequestImagesShort[listRequestImagesShort.length - 1].push(image)
    })
    Object.keys(getImages).forEach((id, index) => {
        getImages[id] = listRequestImagesShort[index]
    })

    return result.map(game => {
        game.images = getImages[game.id]
        return game
    })
}

const getAllGuilds = async () => {
    const result = await Guild.findAll()
    const getImages = {}
    
    const games = await getAllGames()

    result.forEach(g => {
        getImages[g.id] = [storageService.get(g.banner), storageService.get(g.logo)]
    })
    let listRequestImages = []
    Object.keys(getImages).forEach(key => {
        listRequestImages = [...listRequestImages, undefined, ...getImages[key]]
    })
    listRequestImages = await Promise.all(listRequestImages)
    const listRequestImagesShort = []
    listRequestImages.forEach(image => {
        if (image == undefined) listRequestImagesShort.push([])
        else listRequestImagesShort[listRequestImagesShort.length - 1].push(image)
    })
    Object.keys(getImages).forEach((id, index) => {
        getImages[id] = listRequestImagesShort[index]
    })

    const guilds = result.map(guild => {
        guild.banner = getImages[guild.id][0]
        guild.logo = getImages[guild.id][1]
        guild.games = games.filter(g => guild.games.includes(g.id))
        return guild
    })
    
    return guilds
}

module.exports = {
    sendMessage,
    getAllGames,
    getAllGuilds
}