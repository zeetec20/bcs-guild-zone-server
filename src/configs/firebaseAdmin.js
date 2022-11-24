const { initializeApp, cert } = require('firebase-admin/app');
const config = require('./firebaseAdminConfig.json')

module.exports = initializeApp({
    credential: cert(config)
})