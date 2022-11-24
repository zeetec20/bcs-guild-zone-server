const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const Guild = createModel(
    [
        {
            name: 'owner',
            type: TypesField.string
        },
        {
            name: 'name',
            type: TypesField.string
        },
        {
            name: 'banner',
            type: TypesField.string
        },
        {
            name: 'logo',
            type: TypesField.string
        },
        {
            name: 'description',
            type: TypesField.string
        },
        {
            name: 'region',
            type: TypesField.string
        },
        {
            name: 'games',
            type: TypesField.array
        },
        {
            name: 'twitter',
            type: TypesField.string,
            default: null,
            required: false
        },
        {
            name: 'telegram',
            type: TypesField.string,
            default: null,
            required: false
        },
        {
            name: 'discord',
            type: TypesField.string,
            default: null,
            required: false
        },
        {
            name: 'email',
            type: TypesField.string,
            default: null,
            required: false
        },
        {
            name: 'totalMember',
            type: TypesField.number
        },
        {
            name: 'openRecruitment',
            type: TypesField.number
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
    collection(database, 'guilds')
)

module.exports = Guild