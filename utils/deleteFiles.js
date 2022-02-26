// @ts-check
const fs = require('fs')
const logger = require('./logger')

/** 
 * @type {typeof import('@utils/deleteFiles')} 
 */
const deleteFiles = async fileArray => {
   await Promise.all(
      fileArray.map(async file => {
         fs.unlink(file, err => {
            if (err) logger.error({ error: err })
         })
      })
   )
}

module.exports = deleteFiles
