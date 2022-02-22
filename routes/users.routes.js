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
const imageToBase64 = require('../utils/imageToBase64')

const { PASSWORD_HASH_SALT_ROUNDS, ACCESS_LEVEL_NORMAL_USER, ACCESS_LEVEL_ADMIN } = process.env
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
         res.status(200).json({
            success: true,
            message: 'Registration successful!',
            user: { ...user.toObject(), profilePhoto: await imageToBase64(user.profilePhoto) },
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
      const { user } = res.locals
      const compare = await bcrypt.compare(req.body.password, user.password)
      if (!compare) throw 'Password incorrect'
      res.status(200).json({
         success: true,
         message: 'Login successful!',
         user: { ...user.toObject(), profilePhoto: await imageToBase64(user.profilePhoto) },
         token: res.locals.token
      })
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
})

// User logout
router.post('/logout', verifyToken, async (req, res) => {
   res.status(200).json({ success: true, message: 'Logged out successfully!' })
})

// Get List of All Users
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
   try {
      const { query } = req
      let pipeline = []
      let temp = []

      if (query.searchValue && query.searchQuery)
         pipeline.push({ $match: { [query.searchValue]: { $regex: query.searchQuery } } })

      if (query.sortValue && (query.sortOrder === '-1' || query.sortOrder === '1'))
         pipeline.push({ $sort: { [query.sortValue]: parseInt(query.sortOrder) } })

      if (pipeline.length > 0)
         temp = await UserModel.aggregate(pipeline)
      else
         temp = await UserModel.find().sort({ updatedAt: -1 })

      const result = await Promise.all(
         temp.map(async user => {
            try {
               return {
                  ...user.toObject(),
                  profilePhoto: await imageToBase64(user.profilePhoto)
               }
            } catch {
               return {
                  ...user,
                  profilePhoto: await imageToBase64(user.profilePhoto)
               }
            }
         })
      )

      res.status(200).json({ success: true, message: 'Here\'s all the users!', users: result })
   } catch (err) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
})

// Get single user
router.get('/:id', verifyToken, async (req, res) => {
   try {
      const user = await UserModel.findById(req.params.id)

      if (
         res.locals.decodedToken.accessLevel < parseInt(ACCESS_LEVEL_ADMIN) &&
         user.email !== res.locals.decodedToken.email
      )
         throw 'Access Denied'

      const result = await {
         ...user.toObject(),
         profilePhoto: await imageToBase64(user.profilePhoto)
      }
      res.status(200).json({ success: true, message: `Here's user ${req.params.id}!`, user: result })
   } catch (err) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
})

// Delete single user
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
   try {
      const user = await UserModel.findByIdAndDelete(req.params.id)
      await fs.promises.unlink(user.profilePhoto)
      res.status(200).json({ success: true, message: `User ${req.params.id} deleted!` })
   } catch (err) {
      logger.error({ error: err })
      res.status(404).json({ success: false, error: err })
   }
})

module.exports = router
