// @ts-check
const jwt = require('jsonwebtoken')
const fs = require('fs')

const { JWT_KEY_LOCATION, ACCESS_LEVEL_ADMIN } = process.env
const JWT_PRIVATE_KEY = fs.readFileSync(JWT_KEY_LOCATION, 'utf8')

/**
 * @param {'register' | 'login' | 'edit'} mode
 * @returns {(
 *    req: import('express').Request,
 *    res: import('express').Response,
 *    next: import('express').NextFunction) => void}
 */
const createToken = mode => (req, res, next) => {
   let accessLevel = 0
   let email = ''

   switch (mode) {
      case 'register':
         accessLevel = req.body.accessLevel
         email = req.body.email
         break
      case 'login':
         accessLevel = res.locals.user.accessLevel
         email = res.locals.user.email
         break
      case 'edit':
         accessLevel = res.locals.decodedToken.accessLevel
         email = 'email' in req.body ? req.body.email : res.locals.decodedToken.email
         break
   }

   const expiresIn = accessLevel === parseInt(ACCESS_LEVEL_ADMIN) ? '1h' : '5h'
   res.locals.token = jwt.sign({ email, accessLevel }, JWT_PRIVATE_KEY, { expiresIn })
   next()
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyToken = (req, res, next) => {
   try {
      const bearerHeader = req.headers.authorization
      if (!bearerHeader) throw 'Access Token not provided'
      const encodedToken = bearerHeader.split(' ')[1]
      const decodedToken = jwt.verify(encodedToken, JWT_PRIVATE_KEY, { algorithms: ['HS256'] })
      res.locals.decodedToken = decodedToken
      next()
   } catch (err) {
      res.status(401).json({ success: false, error: err })
   }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const verifyAdmin = (req, res, next) => {
   res.locals.decodedToken.accessLevel === parseInt(ACCESS_LEVEL_ADMIN)
      ? next()
      : res.status(401).json({ success: false, error: 'Access denied' })
}

module.exports = { createToken, verifyToken, verifyAdmin }
