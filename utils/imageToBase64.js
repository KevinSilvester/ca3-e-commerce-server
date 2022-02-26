// @ts-check
const fs = require('fs')

/** 
 * @type {typeof import('@utils/imageToBase64')} 
 */
const imageToBase64 = async imagePath => {
   if (typeof imagePath === 'string') {
      const imgBase64 = await fs.promises.readFile(imagePath, { encoding: 'base64' })
      const imgType = imagePath.split('.').pop()
      return `data:image/${imgType};base64,${imgBase64}`
   }
   else return null
}

module.exports = imageToBase64