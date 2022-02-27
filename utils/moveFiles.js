// @ts-check
const fs = require('fs')
const logger = require('./logger')

/**
 * @param {Array<string>} fileArray
 * @param {string} source
 * @param {string} destination
 */
const moveFiles = async (fileArray, source, destination) => {
   await Promise.all(
      fileArray.map(async oldPath => {
         const newPath = oldPath.replace(source, destination)
         fs.rename(oldPath, newPath, err => {
            if (err) logger.error({ error: err })
         })
      })
   )
}

module.exports = moveFiles
