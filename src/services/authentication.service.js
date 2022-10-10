const { Gamer, GuildManager } = require("../models")
const {status} = require('../helpers/response')
const {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} = require('firebase/auth')
const { firebase } = require("../configs")
const errorWithStatus = require("../helpers/errorWithStatus")
const jwt = require('jsonwebtoken')
const { token_secret, token_expired } = require("../configs/env")

const auth = getAuth(firebase)

/**
 * @param  {string} email
 * @param  {string} password
 * @returns {Promise<{access_token, expires_in}>}
 */
const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const token = jwt.sign({id: credential.user.uid, email: credential.user.email}, token_secret, {
        expiresIn: token_expired
    })
    return {
        access_token: token,
        expires_in: token_expired
    }
}

/**
 * @param  {string} email
 * @param  {string} password
 * @returns {Promise<GuildManager>}
 */
const registerGameManager = async (email, password) => {
    const result = await GuildManager.find([['email', '==', email]])
    if (result.length != 0) throw errorWithStatus('email already use other user', status.CONFLICT)
    
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const guildManager = new GuildManager({id: credential.user.uid, email})
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
    const gamer = new Gamer({id: credential.user.uid, name, email})
    await gamer.save()
    
    return gamer
}

module.exports = {
    login,
    registerGameManager,
    registerGamer
}