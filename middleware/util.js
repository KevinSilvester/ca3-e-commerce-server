const { customAlphabet } = require('nanoid')
const { alphanumeric } = require('nanoid-dictionary')

const nanoid = customAlphabet(alphanumeric, 17)

const generateID = name => (req, res, next) => {
   res.locals.id = req.params.id || `${name}-${nanoid()}`
   next()
}

const createFileArray = (req, res, next) => {
   res.locals.files = []
   next()
}

const checkForFiles = (req, res, next) => {
   if (!req.files.length && !res.locals.files.length)
      res.status(406).json({ success: false, error: 'No profile photo provided' })
   else 
      next()
}

module.exports = { generateID, createFileArray, checkForFiles }

