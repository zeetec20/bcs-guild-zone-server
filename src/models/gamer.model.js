const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const userType = require("../helpers/userType")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const Gamer = createModel(
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
            name: 'type',
            type: TypesField.string,
            default: userType.GAMER,
            required: false
        },
        {
            name: 'isJoinGuild',
            type: TypesField.boolean,
            default: false,
            required: false
        }, ,
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
    collection(database, 'users')
)

class GamerRefactor extends Gamer {
    /**
     * @param  {[string | FieldPath, WhereFilterOp, any][]} findQuery
     * @returns {Promise<[GamerRefactor]>}
     */
    static find = (findQuery) => Gamer.find([['type', '==', userType.GAMER], ...findQuery])
}

module.exports = GamerRefactor