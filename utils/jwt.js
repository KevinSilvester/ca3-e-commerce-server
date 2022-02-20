const jwt = require('jsonwebtoken')
const fs = require('fs')

const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_KEY_LOCATION, 'utf8')

const createToken = (email, accessLevel) =>
   jwt.sign({ email, accessLevel }, JWT_PRIVATE_KEY, { expiresIn: process.env.JWT_EXPIRY })

module.exports = { createToken }
