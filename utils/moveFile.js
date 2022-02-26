// @ts-check
const fs = require('fs')

/**
 * @type {typeof import('@utils/moveFile')}
 */
const moveFile = async (file, source, destination) => {
   if (typeof file === 'string') {
      const newFilePath = file.replace(source, destination)
      await fs.promises.rename(file, newFilePath)
   }
}

module.exports = moveFile