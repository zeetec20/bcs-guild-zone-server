const { initializeApp } = require('firebase/app')
const config = require('./firebaseConfig.json')

module.exports = initializeApp(config);