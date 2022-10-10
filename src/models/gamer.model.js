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
const userType = require('../helpers/userType')

const userCollection = collection(database, 'users')

/**
 * @param  {DocumentSnapshot} snapshot
 */
 const snapshotToObject = (snapshot) => {
    const data = snapshot.data()
    const instance = new Gamer({ id: snapshot.ref.id, ...data })
    Object.keys(data).filter(key => instance[key] == undefined).forEach(key => instance.additionalField[key] = data[key])
    instance.doc = snapshot.ref
    return instance
}

/**
 * @param  {string} id
 * @returns {Promise<null | Gamer>}
 */
const findById = async (id) => {
    const dRef = doc(database, userCollection.id, id)
    const snapshot = await getDoc(dRef)
    if (snapshot.exists()) return snapshotToObject(snapshot)
    return null
}

/**
 * @param  {[
 *  ['field', '==', value]
 * ]} findQuery
 * @returns {Promise<Gamer[]>}
 */
const find = async (findQuery) => {
    const q = query(userCollection, ...findQuery.map(query => where(...query)))
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

/**
 * @returns {Promise<Gamer[]>}
 */
 const findAll = async () => {
    const q = query(userCollection)
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

class Gamer {
    constructor({
        id,
        name,
        email,
        type = userType.GAMER,
        isJoinGuild = false,
        createdAt = Timestamp.fromMillis(utcDate),
        updatedAt = Timestamp.fromMillis(utcDate)
    }) {
        this.id = id
        this.name = name
        this.email = email
        this.type = type
        this.isJoinGuild = isJoinGuild
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.additionalField = {}
        this.doc = null
    }

    toJson = (alsoid = false) => {
        const json = {
            name: this.name,
            email: this.email,
            type: this.type,
            isJoinGuild: this.isJoinGuild,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ...this.additionalField
        }
        if (alsoid) json.id = this.id
        return json
    }

    save = async () => {
        if (this.doc == null) {
            if (this.id != null) {
                const dRef = doc(database, userCollection.id, this.id)
                await setDoc(dRef, this.toJson())
                this.doc = dRef
            } else {
                const dRef = await addDoc(userCollection, this.toJson())
                this.id = dRef.id
                this.doc = dRef
            }
        } else await updateDoc(this.doc, this.toJson())
    }
}

module.exports = Gamer

module.exports.snapshotToObject = snapshotToObject
module.exports.findById = findById
module.exports.find = find
module.exports.find = findAll
module.exports.collection = userCollection