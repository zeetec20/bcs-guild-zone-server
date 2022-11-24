const { collection, Timestamp } = require("firebase/firestore")
const database = require("../database")
const userType = require("../helpers/userType")
const utcDate = require("../helpers/utcDate")
const { createModel, TypesField } = require("./model")

const GuildManager = createModel(
    [
        {
            name: 'email',
            type: TypesField.string
        },
        {
            name: 'type',
            type: TypesField.string,
            default: userType.GUILD_MANAGER,
            required: false
        },
        {
            name: 'isHaveGuild',
            type: TypesField.boolean,
            default: false,
            required: false
        },
        {
            name: 'guild',
            type: TypesField.string,
            default: null,
            required: false
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
    collection(database, 'users')
)

class GuildManagerRefactor extends GuildManager {
    /**
     * @param  {[string | FieldPath, WhereFilterOp, any][]} findQuery
     * @returns {Promise<[GuildManagerRefactor]>}
     */
    static find = (findQuery) => GuildManager.find([['type', '==', userType.GUILD_MANAGER], ...findQuery])
}

module.exports = GuildManagerRefactor