const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_KEY_LOCATION, 'utf8')

// const createToken = (email, accessLevel) => {
//    expiresIn = accessLevel === parseInt(process.env.ACCESS_LEVEL_ADMIN) ? '1h' : '5h'
//    return jwt.sign({ email, accessLevel }, JWT_PRIVATE_KEY, { expiresIn })
// }

const createToken = (req, res, next) => {
   const expiresIn = req.body.accessLevel === parseInt(process.env.ACCESS_LEVEL_ADMIN) ? '1h' : '5h'
   res.locals.token = jwt.sign(
      { id: req.body._id, accessLevel: req.body.accessLevel },
      JWT_PRIVATE_KEY,
      { expiresIn }
   )
   next()
}

const verifyToken = (req, res, next) => {
   try {
      const bearerHeader = req.headers.authorization
      if (!bearerHeader) throw 'Access Token not provided'
      const encodedToken = bearerHeader.split(' ')[1]
      const decodedToken = jwt.verify(encodedToken, JWT_PRIVATE_KEY)
      res.locals.decodedToken = decodedToken
      next()
   } catch (err) {
      res.status(401).json({ success: false, error: err })
   }
}

const verifyAdmin = (req, res, next) => {
   res.locals.decodedToken.accessLevel === parseInt(process.env.ACCESS_LEVEL_ADMIN)
      ? next()
      : res.status(401).json({ success: false, error: 'Access denied' })
}

module.exports = { createToken, verifyToken, verifyAdmin }
