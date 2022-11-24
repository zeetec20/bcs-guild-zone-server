const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const Message = createModel(
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
            name: 'message',
            type: TypesField.string
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
    collection(database, 'messages')
)

module.exports = Message