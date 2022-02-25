const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_KEY_LOCATION, 'utf8')

const createToken = mode => (req, res, next) => {
   // body when creating new user as request body will contain the email and accessLevel
   // locals when logging in user as checkUserExists middleware will set the variable user variable
   // pass in modes and use switch statements
   let accessLevel = 0
   let email = ''

   switch (mode) {
      case 'register':
         [accessLevel, email] = [req.body.accessLevel, req.body.email]
         break
      case 'login':
         [accessLevel, email] = [res.locals.user.accessLevel, res.locals.user.email]
         break
      case 'edit':
         [accessLevel, email] = [
            res.locals.decodedToken.accessLevel,
            res.body.email || res.locals.user.email
         ]
         break
   }

   const expiresIn = accessLevel === parseInt(process.env.ACCESS_LEVEL_ADMIN) ? '1h' : '5h'
   res.locals.token = jwt.sign({ email, accessLevel }, JWT_PRIVATE_KEY, { expiresIn })
   next()
}

const verifyToken = (req, res, next) => {
   try {
      const bearerHeader = req.headers.authorization
      if (!bearerHeader) throw 'Access Token not provided'
      const encodedToken = bearerHeader.split(' ')[1]
      const decodedToken = jwt.verify(encodedToken, JWT_PRIVATE_KEY, {algorithm: "HS256"})
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
