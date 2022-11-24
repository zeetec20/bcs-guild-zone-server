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
    doc,
    deleteDoc,
    WhereFilterOp,
    FieldPath
} = require('firebase/firestore')
const database = require("../database")
const utcDate = require('../helpers/utcDate')

const TypesField = {
    string: '[object String]',
    number: '[object Number]',
    object: '[object Object]',
    array: '[object Array]',
    boolean: '[object Boolean]',
    dynamic: null
}

/**
 * @param  {{name: string, default: string?, type: string, required: boolean?}[]} fields
 * @param  {collection} collection
 */
const createModel = (fields, collection) => {
    if (!fields.map(e => e.name).includes('id')) fields.push({
        name: 'id',
        type: TypesField.string,
    })
    fields = fields.map(field => ({ ...field, required: field.required ?? true }))

    class Model {
        /**
         * @param {{[key: string]: string | {[key: string]: any} | number | Array<any>}} args
         */
        constructor(args) {
            fields.filter(field => field.name != 'id').forEach(field => {
                const ErrorType = Error(`Error type on field ${field.name}`)
                if (field.required && args[field.name] == null) throw Error(`Error required on field ${field.name}`)
                if (!((!field.required ? args[field.name] == null : false) || this.getType(args[field.name]) == field.type)) throw ErrorType

                Object.defineProperty(this, field.name, {
                    get: () => this._data[field.name],
                    set: value => {
                        if (!(this.getType(value) == field.type)) throw ErrorType
                        this._data[field.name] = value
                    }
                })

                this._data[field.name] = args[field.name] ?? field.default
            })
            this.id = args.id
            this.createdAt = Timestamp.fromMillis(utcDate)
            this.updatedAt = Timestamp.fromMillis(utcDate)
            this.doc = null
        }

        _error = []
        _data = {}

        /**
         * @param  {DocumentSnapshot} snapshot
         */
        static snapshotToObject = (snapshot) => {
            const data = snapshot.data()
            const instance = new Model({ id: snapshot.ref.id, ...data })
            instance.doc = snapshot.ref
            return instance
        }

        /**
         * @param  {string} id
         * @returns {Promise<null | Model>}
         */
        static findById = async (id) => {
            const dRef = doc(database, collection.id, id)
            const snapshot = await getDoc(dRef)
            if (snapshot.exists()) return Model.snapshotToObject(snapshot)
            return null
        }

        /**
         * @param  {[string | FieldPath, WhereFilterOp, any][]} findQuery
         * @returns {Promise<[Model]>}
         */
        static find = async (findQuery) => {
            const q = query(collection, ...findQuery.map(query => where(...query)))
            return (await getDocs(q)).docs.map(snapshot => Model.snapshotToObject(snapshot))
        }

        /**
         * @returns {Promise<Model[]>}
         */
        static findAll = async () => {
            return (await getDocs(collection)).docs.map(snapshot => Model.snapshotToObject(snapshot))
        }

        static remove = id => deleteDoc(doc(database, collection.id, id))

        checkAllowTypeData = value => Object.values(TypesField).filter(e => e != null).includes(this.getType(value))

        getType = value => Object.prototype.toString.call(value)

        toJson(showId = false) {
            if (this._error.length) this._error.forEach(err => { throw err })

            const keys = Object.keys(this)
                .filter(key => key == 'id' ? showId : this.checkAllowTypeData(this[key]))
                .filter(key => !['doc', '_data', '_error'].includes(key))
            const json = { ...this._data }
            keys.forEach(key => json[key] = this[key])

            return json
        }

        save = async () => {
            if (this.doc == null) {
                if (this.id != null) {
                    const dRef = doc(database, collection.id, this.id)
                    await setDoc(dRef, this.toJson())
                    this.doc = dRef
                } else {
                    const dRef = await addDoc(collection, this.toJson())
                    this.id = dRef.id
                    this.doc = dRef
                }
            } else await updateDoc(this.doc, this.toJson())
        }

        remove = async () => await deleteDoc(this.doc)
    }

    return Model
}

module.exports.createModel = createModel
module.exports.TypesField = TypesField