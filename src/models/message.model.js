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

const messageCollection = collection(database, 'messages')

/**
 * @param  {DocumentSnapshot} snapshot
 */
 const snapshotToObject = (snapshot) => {
    const data = snapshot.data()
    const instance = new Message({ id: snapshot.ref.id, ...data })
    Object.keys(data).filter(key => instance[key] == undefined).forEach(key => instance.additionalField[key] = data[key])
    instance.doc = snapshot.ref
    return instance
}

/**
 * @param  {string} id
 * @returns {Promise<null | Message>}
 */
const findById = async (id) => {
    const dRef = doc(database, messageCollection.id, id)
    const snapshot = await getDoc(dRef)
    if (snapshot.exists()) return snapshotToObject(snapshot)
    return null
}

/**
 * @param  {[
 *  ['field', '==', value]
 * ]} findQuery
 * @returns {Promise<[Message]>}
 */
const find = async (findQuery) => {
    const q = query(messageCollection, ...findQuery.map(query => where(...query)))
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

/**
 * @returns {Promise<Message[]>}
 */
 const findAll = async () => {
    return (await getDocs(messageCollection)).docs.map(snapshot => snapshotToObject(snapshot))
}

class Message {
    constructor({
        id,
        name,
        email,
        message,
        createdAt = Timestamp.fromMillis(utcDate),
        updatedAt = Timestamp.fromMillis(utcDate)
    }) {
        this.id = id
        this.name = name
        this.email = email
        this.message = message
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.additionalField = {}
        this.doc = null
    }

    toJson = (alsoId = false) => {
        const json = {
            name: this.name,
            email: this.email,
            message: this.message,
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
                const dRef = doc(database, messageCollection.id, this.id)
                await setDoc(dRef, this.toJson())
                this.doc = dRef
            } else {
                const dRef = await addDoc(messageCollection, this.toJson())
                this.id = dRef.id
                this.doc = dRef
            }
        } else await updateDoc(this.doc, this.toJson())
    }
}

module.exports = Message

module.exports.snapshotToObject = snapshotToObject
module.exports.findById = findById
module.exports.find = find
module.exports.findAll = findAll
module.exports.collection = messageCollection