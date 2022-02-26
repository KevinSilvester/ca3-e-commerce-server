// @ts-check
const { customAlphabet } = require('nanoid')
const { alphanumeric } = require('nanoid-dictionary')

const nanoid = customAlphabet(alphanumeric, 17)

/**
 * @type {typeof import('@middleware/util').generateID}
 */
const generateID = name => (req, res, next) => {
   res.locals.id = req.params.id || `${name}-${nanoid()}`
   next()
}

/**
 * @type {typeof import('@middleware/util').createFileArray}
 */
const createFileArray = (req, res, next) => {
   res.locals.files = []
   next()
}

/**
 * @type {typeof import('@middleware/util').checkForFiles}
 */
const checkForFiles = (req, res, next) => {
   !req.files.length && !res.locals.files.length
      ? res.status(406).json({ success: false, error: 'No profile photo provided' })
      : next()
}

module.exports = { generateID, createFileArray, checkForFiles }
