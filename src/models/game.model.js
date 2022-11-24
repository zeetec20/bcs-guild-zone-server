const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const Game = createModel(
    [
        {
            name: 'name',
            type: TypesField.string
        },
        {
            name: 'description',
            type: TypesField.string
        },
        {
            name: 'genre',
            type: TypesField.array
        },
        {
            name: 'images',
            type: TypesField.array
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
    collection(database, 'games')
)

module.exports = Game