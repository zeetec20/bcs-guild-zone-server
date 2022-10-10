module.exports = {
    errorHandler: require('./errorHandler.middleware'),
    logging: require('./logging.middleware'),
    validator: require('./validators'),
    upload: require('./upload.middleware'),
    uploadWithoutSave: require('./uploadWithoutSave.middleware'),
    isAuthenticated: require('./isAuthenticated.middleware')
}