const {getFirestore} = require('firebase/firestore')
const { firebase } = require('../configs')

module.exports = getFirestore(firebase)