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

const gamesCollection = collection(database, 'games')

/**
 * @param  {DocumentSnapshot} snapshot
 */
 const snapshotToObject = (snapshot) => {
    const data = snapshot.data()
    const instance = new Game({ id: snapshot.ref.id, ...data })
    Object.keys(data).filter(key => instance[key] == undefined).forEach(key => instance.additionalField[key] = data[key])
    instance.doc = snapshot.ref
    return instance
}

/**
 * @param  {string} id
 * @returns {Promise<null | Game>}
 */
const findById = async (id) => {
    const dRef = doc(database, gamesCollection.id, id)
    const snapshot = await getDoc(dRef)
    if (snapshot.exists()) return snapshotToObject(snapshot)
    return null
}

/**
 * @param  {[
 *  ['field', '==', value]
 * ]} findQuery
 * @returns {Promise<Game[]>}
 */
const find = async (findQuery) => {
    const q = query(gamesCollection, ...findQuery.map(query => where(...query)))
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

/**
 * @returns {Promise<Game[]>}
 */
const findAll = async () => {
    return (await getDocs(gamesCollection)).docs.map(snapshot => snapshotToObject(snapshot))
}

class Game {
    constructor({
        id,
        name,
        description,
        genre,
        images,
        createdAt = Timestamp.fromMillis(utcDate),
        updatedAt = Timestamp.fromMillis(utcDate)
    }) {
        this.id = id
        this.name = name
        this.description = description
        this.genre = genre
        this.images = images
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.additionalField = {}
        this.doc = null
    }

    toJson = (alsoId = false) => {
        const json = {
            name: this.name,
            description: this.description,
            genre: this.genre,
            images: this.images,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            ...this.additionalField,
        }
        if (alsoId) json.id = this.id
        return json
    }

    save = async () => {
        if (this.doc == null) {
            if (this.id != null) {
                const dRef = doc(database, gamesCollection.id, this.id)
                await setDoc(dRef, this.toJson())
                this.doc = dRef
            } else {
                const dRef = await addDoc(gamesCollection, this.toJson())
                this.id = dRef.id
                this.doc = dRef
            }
        } else await updateDoc(this.doc, this.toJson())
    }
}

module.exports = Game

module.exports.snapshotToObject = snapshotToObject
module.exports.findById = findById
module.exports.find = find
module.exports.findAll = findAll
module.exports.collection = gamesCollection