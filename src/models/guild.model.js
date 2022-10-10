const {
    collection,
    Timestamp,
    DocumentSnapshot,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    setDoc,
    doc
} = require('firebase/firestore')
const database = require("../database")
const utcDate = require('../helpers/utcDate')

const guildCollection = collection(database, 'guilds')

/**
 * @param  {DocumentSnapshot} snapshot
 */
 const snapshotToObject = (snapshot) => {
    const data = snapshot.data()
    const instance = new Guild({ id: snapshot.ref.id, ...data })
    Object.keys(data).filter(key => instance[key] == undefined).forEach(key => instance.additionalField[key] = data[key])
    instance.doc = snapshot.ref
    return instance
}

/**
 * @param  {string} id
 * @returns {Promise<null | Guild>}
 */
const findById = async (id) => {
    const dRef = doc(database, guildCollection.id, id)
    const snapshot = await getDoc(dRef)
    if (snapshot.exists()) return snapshotToObject(snapshot)
    return null
}

/**
 * @param  {[
 *  ['field', '==', value]
 * ]} findQuery
 * @returns {Promise<[Guild]>}
 */
const find = async (findQuery) => {
    const q = query(guildCollection, ...findQuery.map(query => where(...query)))
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

/**
 * @returns {Promise<Guild[]>}
 */
 const findAll = async () => {
    const q = query(guildCollection)
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

class Guild {
    constructor({
        id = null,
        owner,
        name,
        banner,
        logo,
        description,
        region,
        games,
        twitter = null,
        telegram = null,
        discord = null,
        email = null,
        totalMember,
        openRecruitment,
        createdAt = Timestamp.fromMillis(utcDate),
        updatedAt = Timestamp.fromMillis(utcDate)
    }) {
        this.id = id
        this.owner = owner
        this.name = name
        this.banner = banner
        this.logo = logo
        this.description = description
        this.region = region
        this.games = games
        this.twitter = twitter
        this.telegram = telegram
        this.discord = discord
        this.email = email
        this.totalMember = totalMember
        this.openRecruitment = openRecruitment
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.additionalField = {}
        this.doc = null
    }

    toJson = (alsoId = false) => {
        const json = {
            owner: this.owner,
            name: this.name,
            banner: this.banner,
            logo: this.logo,
            description: this.description,
            region: this.region,
            games: this.games,
            twitter: this.twitter,
            telegram: this.telegram,
            discord: this.discord,
            email: this.email,
            totalMember: this.totalMember,
            openRecruitment: this.openRecruitment,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ...this.additionalField
        }
        if (alsoId) json.id = this.id
        return json
    }

    save = async () => {
        if (this.doc == null) {
            if (this.id != null) {
                const dRef = doc(database, guildCollection.id, this.id)
                await setDoc(dRef, this.toJson())
                this.doc = dRef
            } else {
                const dRef = await addDoc(guildCollection, this.toJson())
                this.id = dRef.id
                this.doc = dRef
            }
        } else await updateDoc(this.doc, this.toJson())
    }
}

module.exports = Guild

module.exports.findById = findById
module.exports.find = find
module.exports.findAll = findAll
module.exports.collection = guildCollection