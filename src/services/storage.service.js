const {getStorage, uploadBytes, ref, getDownloadURL, deleteObject} = require('firebase/storage')
const { firebase } = require('../configs')

const storage = getStorage(firebase)

/**
 * @param  {string} file
 * @param  {string} path
 * @returns {Promise<string>}
 */
const upload = async (file, path, metadata = null) => {
    await uploadBytes(ref(storage, path), file, metadata)
    return path
}

/**
 * @param  {string} path
 */
const get = async (path) => {
    return await getDownloadURL(ref(storage, path))
}

/**
 * @param  {string} path
 */
const del = async (path) => {
    await deleteObject(ref(storage, path))
}

module.exports = {
    upload,
    get,
    delete: del
}