const { Router } = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs')
const multer = require('multer')
const empty = require('empty-folder')

const UserModel = require('../models/user.model')
const {
   validateCreateUser,
   generateUserID,
   validateUserFiles,
   checkForDuplicates,
   validateLoginUser,
   checkUserExists
} = require('../middleware/user.middleware')
const { createToken, verifyToken, verifyAdmin } = require('../middleware/auth')
const logger = require('../utils/logger')
const multerConfig = require('../config/multerConfig')

const { PASSWORD_HASH_SALT_ROUNDS, JWT_KEY_LOCATION, JWT_EXPIRY } = process.env
const router = Router()
const upload = multer(multerConfig('profile'))

// Create new user
router.post(
   '/register',
   generateUserID,
   upload.array('profilePhoto', 1),
   validateUserFiles,
   validateCreateUser,
   checkForDuplicates,
   createToken,
   async (req, res) => {
      try {
         const password = await bcrypt.hash(req.body.password, parseInt(PASSWORD_HASH_SALT_ROUNDS))
         const document = {
            ...req.body,
            _id: res.locals.id,
            password,
            profilePhoto: res.locals.files[0]
         }
         const user = await UserModel.create(document)
         // const token = createToken(user.email, user.accessLevel)
         const imgBase64 = await fs.promises.readFile(user.profilePhoto, { encoding: 'base64' })
         const imgType = user.profilePhoto.split('.').pop()
         res.status(200).json({
            success: true,
            message: 'Registration successful! ヾ(≧▽≦*)o',
            user: { ...user.toObject(), profilePhoto: `data:image/${imgType};base64,${imgBase64}` },
            token: res.locals.token
         })
      } catch (err) {
         logger.error({ error: err })
         res.status(409).json({ success: false, error: err })
      }
   }
)

// User login
router.post('/login', validateLoginUser, checkUserExists, createToken, async (req, res) => {
   try {
      console.log(req.headers)
      const { user } = res.locals
      const compare = await bcrypt.compare(req.body.password, user.password)
      if (!compare) throw 'Password incorrect'
      // const token = createToken(user._id, user.accessLevel)
      const imgBase64 = await fs.promises.readFile(user.profilePhoto, { encoding: 'base64' })
      const imgType = user.profilePhoto.split('.').pop()
      res.status(200).json({
         success: true,
         message: 'Login successful! ヾ(≧▽≦*)o',
         user: { ...user.toObject(), profilePhoto: `data:image/${imgType};base64,${imgBase64}` },
         token: res.locals.token
      })
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
})

// User logout
router.post('/logout', verifyToken, async (req, res) => {
   res.status(200).json({ success: true, message: 'Logged out successfully! ヾ(≧▽≦*)o', })
})

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
   try {

   } catch (err) {
      
   }
})

module.exports = router
