const multer = require('multer');
const path = require('path')
const uuid = require('uuid')
const { status } = require('../helpers/response');

/**
 * @param  {number} limit=3
 * @param  {boolean} onlyImage=true
 */
const upload = (limit = 3, onlyImage = true) => {
    const storage = multer.diskStorage({
        destination: 'src/public/images/',
        filename: function ( req, file, cb ) {
            cb( null, `image-${uuid.v4()}${path.extname(file.originalname)}`);
        }
    })
    
    return multer({
        storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname)
            if (onlyImage && (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg')) return callback(errorWithStatus('file is not permitted', status.BAD_REQUEST))
            callback(null, true)
        },
        limits: {
            fileSize: limit * (1024 * 1024)
        }
    })
}

module.exports = upload