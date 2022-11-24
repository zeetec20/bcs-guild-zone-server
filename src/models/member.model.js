const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const Member = createModel(
    [
        {
            name: 'name',
            type: TypesField.string
        },
        {
            name: 'email',
            type: TypesField.string
        },
        {
            name: 'experience',
            type: TypesField.string
        },
        {
            name: 'recent_game',
            type: TypesField.string
        },
        {
            name: 'gamer',
            type: TypesField.string,
            required: false,
            default: null
        },
        {
            name: 'guild',
            type: TypesField.string
        },
        {
            name: 'isAccept',
            type: TypesField.boolean,
            required: false,
            default: false
        },
        {
            name: 'createdAt',
            type: TypesField.object,
            default: Timestamp.fromMillis(utcDate),
            required: false
        },
        {
            name: 'updatedAt',
            type: TypesField.object,
            default: Timestamp.fromMillis(utcDate),
            required: false
        }
    ],
    collection(database, 'member')
)

module.exports = Member