// @ts-check
const { customAlphabet } = require('nanoid')
const { alphanumeric } = require('nanoid-dictionary')

const nanoid = customAlphabet(alphanumeric, 17)

/**
 * @param {'user' | 'product' | 'purchase' | null} name
 * @returns {(
 *    req: import('express').Request, 
 *    res: import('express').Response, 
 *    next: import('express').NextFunction) => void}
 */
const generateID = name => (req, res, next) => {
   res.locals.id = req.params.id || `${name}-${nanoid()}`
   next()
}

/**
 * Middleware to create an empty array called 'files'.
 * This array will be populated by the path to where multer will store any files uploaded during the request.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const createFileArray = (req, res, next) => {
   res.locals.files = []
   next()
}

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const checkForFiles = (req, res, next) => {
   console.log(res.locals.files, req.body)
   !req.files.length && !res.locals.files.length
      ? res.status(406).json({ success: false, error: 'No profile photo provided' })
      : next()
}

module.exports = { generateID, createFileArray, checkForFiles }
