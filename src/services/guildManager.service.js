const { Guild, GuildManager } = require("../models")
const errorWithStatus = require("../helpers/errorWithStatus")
const { status } = require("../helpers/response")
const storageService = require("./storage.service")
const stringToSlug = require('../helpers/stringToSlug')

/**
 * @param  {string} owner
 * @param  {string} name
 * @param  {{buffer, mimetype}} banner
 * @param  {{buffer, mimetype}} logo
 * @param  {string} description
 * @param  {string} games
 * @param  {string} twitter
 * @param  {string} telegram
 * @param  {string} discord
 * @param  {string} email
 * @param  {string} totalMember
 * @param  {string} openRecruitment
 */
const createGuild = async (
    owner,
    name,
    banner,
    logo,
    description,
    region,
    games,
    twitter,
    telegram,
    discord,
    email,
    totalMember,
    openRecruitment
) => {
    const manager = await GuildManager.findById(owner)
    if (manager == null) throw errorWithStatus('owner user not exist', status.BAD_REQUEST)
    if (manager.isHaveGuild) throw errorWithStatus('guild already created', status.CONFLICT)
    if (!(twitter || telegram || discord || email)) throw errorWithStatus('one social media must filled', status.BAD_REQUEST)
    
    const guild = new Guild({
        owner,
        name,
        banner: '',
        logo: '',
        description,
        region,
        games: games.split(', '),
        twitter,
        telegram,
        discord,
        email,
        totalMember,
        openRecruitment
    })
    await guild.save()

    const extBanner = banner.mimetype.split('/')[1]
    const pathBanner = await storageService.upload(banner.buffer, `images/guild/${stringToSlug(guild.name)}/banner-${guild.id}.${extBanner}`, {
        contentType: banner.mimetype
    })
    const extLogo = banner.mimetype.split('/')[1]
    const pathLogo = await storageService.upload(logo.buffer, `images/guild/${stringToSlug(guild.name)}/banner-${guild.id}.${extLogo}`, {
        contentType: banner.mimetype
    })
    guild.banner = pathBanner
    guild.logo = pathLogo
    await guild.save()

    manager.isHaveGuild = true
    manager.additionalField = {guild: guild.id}
    await manager.save()

    return guild
}

module.exports = {
    createGuild
}