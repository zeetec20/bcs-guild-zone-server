const {initializeApp} = require('firebase/app')
const config = require('./firebaseConfig')

module.exports = initializeApp(config);