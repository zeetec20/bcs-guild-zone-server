const sharp = require('sharp')

/**
 * @param  {string} path
 * @param  {number} quality=80
 */
module.exports = async (path, quality=80) => {
    let newFilename = path.split('.')
    newFilename.pop()
    newFilename = `${newFilename.join('.')}.min.${path.split('.').pop()}`
    await sharp(path).webp({quality: quality}).toFile(newFilename)
}