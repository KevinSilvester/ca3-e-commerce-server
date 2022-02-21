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

const { PASSWORD_HASH_SALT_ROUNDS } = process.env
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
      let aggregate = []
      let temp = []

      if (query.searchValue && query.searchQuery)
         aggregate.push({ $match: { [query.searchValue]: { $regex: query.searchQuery } } })

      if (query.sortValue && (query.sortOrder === '-1' || query.sortOrder === '1'))
         aggregate.push({ $sort: { [query.sortValue]: parseInt(query.sortOrder) } })

      if (aggregate.length > 0)
         temp = await UserModel.aggregate(aggregate)
      else 
         temp = await UserModel.find().sort({ updatedAt: -1 })

      const result = await Promise.all(
         temp.map(async user => ({
            ...user.toObject(),
            profilePhoto: await imageToBase64(user.profilePhoto)
         }))
      )

      res.status(200).json({ success: true, aggregate, users: result })
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
})

module.exports = router
