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

const memberCollection = collection(database, 'member')

/**
 * @param  {DocumentSnapshot} snapshot
 */
const snapshotToObject = (snapshot) => {
    const data = snapshot.data()
    const instance = new Member({ id: snapshot.ref.id, ...data })
    Object.keys(data).filter(key => instance[key] == undefined).forEach(key => instance.additionalField[key] = data[key])
    instance.doc = snapshot.ref
    return instance
}

/**
 * @param  {string} id
 * @returns {Promise<null | Member>}
 */
const findById = async (id) => {
    const dRef = doc(database, memberCollection.id, id)
    const snapshot = await getDoc(dRef)
    if (snapshot.exists()) return snapshotToObject(snapshot)
    return null
}

/**
 * @param  {[
 *  ['field', '==', value]
 * ]} findQuery
 * @returns {Promise<[Member]>}
 */
const find = async (findQuery) => {
    const q = query(memberCollection, ...findQuery.map(query => where(...query)))
    return (await getDocs(q)).docs.map(snapshot => snapshotToObject(snapshot))
}

/**
 * @returns {Promise<Member[]>}
 */
const findAll = async () => {
    return (await getDocs(memberCollection)).docs.map(snapshot => snapshotToObject(snapshot))
}

class Member {
    constructor({
        id,
        name,
        email,
        experience,
        recent_game,
        gamer,
        guild,
        isAccept = false,
        createdAt = Timestamp.fromMillis(utcDate),
        updatedAt = Timestamp.fromMillis(utcDate)
    }) {
        this.id = id
        this.name = name
        this.email = email
        this.experience = experience
        this.recent_game = recent_game
        this.gamer = gamer
        this.guild = guild
        this.isAccept = isAccept
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.additionalField = {}
        this.doc = null
    }

    toJson = (alsoId = false) => {
        const json = {
            name: this.name,
            email: this.email,
            experience: this.experience,
            recent_game: this.recent_game,
            gamer: this.gamer,
            guild: this.guild,
            isAccept: this.isAccept,
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
                const dRef = doc(database, memberCollection.id, this.id)
                await setDoc(dRef, this.toJson())
                this.doc = dRef
            } else {
                const dRef = await addDoc(memberCollection, this.toJson())
                this.id = dRef.id
                this.doc = dRef
            }
        } else await updateDoc(this.doc, this.toJson())
    }
}

module.exports = Member

module.exports.snapshotToObject = snapshotToObject
module.exports.findById = findById
module.exports.find = find
module.exports.findAll = findAll
module.exports.collection = memberCollection