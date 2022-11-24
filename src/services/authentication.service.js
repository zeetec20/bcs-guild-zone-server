const { Gamer, GuildManager } = require("../models")
const { status } = require('../helpers/response')
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth')
const { getAuth: getAuthAdmin } = require('firebase-admin/auth')
const { firebase, firebaseAdmin } = require("../configs")
const errorWithStatus = require("../helpers/errorWithStatus")
const jwt = require('jsonwebtoken')
const { token_secret, token_expired } = require("../configs/env")
const userType = require("../helpers/userType")

const auth = getAuth(firebase)

/**
 * @param  {string} email
 * @param  {string} password
 * @returns {Promise<{access_token, expires_in}>}
 */
const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const token = jwt.sign({ id: credential.user.uid, email: credential.user.email }, token_secret, {
        expiresIn: token_expired
    })
    return {
        access_token: token,
        expires_in: token_expired
    }
}

/**
 * @param  {string} email
 */
const removeUser = async (email) => {
    email = email.toLowerCase()
    const guildManager = (await GuildManager.find([['email', '==', email]]))[0]
    const gamer = (await Gamer.find([['email', '==', email]]))[0]
    const user = guildManager ?? gamer
    
    await getAuthAdmin(firebaseAdmin).deleteUser(user.id)
    await user.remove()
}

/**
 * @param  {string} id
 */
const user = async (id) => {
    const guildManager = await GuildManager.findById(id)
    if (guildManager.type == userType.GUILD_MANAGER) return guildManager

    const gamer = await Gamer.findById(id)
    if (gamer.type == userType.GAMER) return gamer

    throw errorWithStatus('User not found', status.NOT_FOUND)
}

/**
 * @param  {string} email
 * @param  {string} password
 * @returns {Promise<GuildManager>}
 */
const registerGuildManager = async (email, password) => {
    const result = await GuildManager.find([['email', '==', email]])
    if (result.length) throw errorWithStatus('email already use other user', status.CONFLICT)

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const guildManager = new GuildManager({ id: credential.user.uid, email })
    await guildManager.save()

    return guildManager
}

/**
 * @param  {string} name
 * @param  {string} email
 * @param  {string} password
 * @returns {Promise<Gamer>}
 */
const registerGamer = async (name, email, password) => {
    const result = await Gamer.find([['email', '==', email]])
    if (result.length != 0) throw errorWithStatus('email already use other user', status.CONFLICT)

    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const gamer = new Gamer({ id: credential.user.uid, name, email })
    await gamer.save()

    return gamer
}

module.exports = {
    login,
    registerGuildManager,
    registerGamer,
    user,
    removeUser,
}