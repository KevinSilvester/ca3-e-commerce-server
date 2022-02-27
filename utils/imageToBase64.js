// @ts-check
const fs = require('fs')

/**
 * @param {string} imagePath
 * @returns {Promise<string>}
 */
const imageToBase64 = async imagePath => {
   const imgBase64 = await fs.promises.readFile(imagePath, { encoding: 'base64' })
   const imgType = imagePath.split('.').pop()
   return `data:image/${imgType};base64,${imgBase64}`
}

module.exports = imageToBase64
