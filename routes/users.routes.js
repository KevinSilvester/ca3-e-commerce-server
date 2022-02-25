const { Router } = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs')
const multer = require('multer')
const empty = require('empty-folder')

const multerConfig = require('../config/multerConfig')
const { createUserSchema, loginUserSchema, editUserSchema } = require('../schema/user.schema')
const UserModel = require('../models/user.model')
const {
   checkForDuplicates,
   checkUserExists,
   validateRequestBody,
   createPipeline
} = require('../middleware/user.middleware')
const { createToken, verifyToken, verifyAdmin } = require('../middleware/auth')
const { generateID, createFileArray, checkForFiles } = require('../middleware/util')
const logger = require('../utils/logger')
const imageToBase64 = require('../utils/imageToBase64')
const deleteFiles = require('../utils/deleteFiles')

const { PASSWORD_HASH_SALT_ROUNDS, ACCESS_LEVEL_NORMAL_USER, ACCESS_LEVEL_ADMIN } = process.env
const router = Router()
const upload = multer(multerConfig('profile'))
const temp = multer(multerConfig('temp'))

// Create new user
router.post(
   '/register',
   generateID('user'),
   createFileArray,
   upload.array('profilePhoto', 1),
   checkForFiles,
   validateRequestBody(createUserSchema),
   checkForDuplicates,
   createToken('register'),
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
         await deleteFiles(res.locals.files)
         logger.error({ error: err })
         // res.status(409).json({ success: false, error: err })
      }
   }
)

// User login
router.post(
   '/login',
   validateRequestBody(loginUserSchema),
   checkUserExists,
   createToken('login'),
   async (req, res) => {
      try {
         const { user } = res.locals
         const compare = await bcrypt.compare(req.body.password, user.password)

         if (!compare) throw 'Password incorrect'
         
         return res.status(200).json({
            success: true,
            message: 'Login successful!',
            user: { ...user.toObject(), profilePhoto: await imageToBase64(user.profilePhoto) },
            token: res.locals.token
         })
      } catch (err) {
         logger.error({ error: err })
         return res.status(401).json({ success: false, error: err })
      }
   }
)

// User logout
router.post('/logout', verifyToken, async (req, res) => {
   return res.status(200).json({ success: true, message: 'Logged out successfully!' })
})

// Get List / Search all Users
router.get('/', verifyToken, verifyAdmin, createPipeline, async (req, res) => {
   try {
      const temp =
         res.locals.pipeline.length > 0
            ? await UserModel.aggregate(res.locals.pipeline)
            : await UserModel.find().sort({ updatedAt: -1 }).lean()

      const result = await Promise.all(
         temp.map(async user => ({
            ...user,
            profilePhoto: await imageToBase64(user.profilePhoto)
         }))
      )

      return res.status(200).json({
         success: true,
         message: "Here's all the users!",
         users: result,
         length: result.length
      })
   } catch (err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: err })
   }
})

// Get single user
router.get('/:id', verifyToken, async (req, res) => {
   try {
      const user = await UserModel.findById(req.params.id).lean()

      if (!user) throw 'No user found'

      if (
         res.locals.decodedToken.accessLevel < parseInt(ACCESS_LEVEL_ADMIN) &&
         user.email !== res.locals.decodedToken.email
      )
         throw 'Access Denied'

      const result = await {
         ...user,
         profilePhoto: await imageToBase64(user.profilePhoto)
      }

      return res.status(200).json({
         success: true,
         message: `Here's user ${req.params.id}!`,
         user: result
      })
   } catch (err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: err })
   }
})

// Delete single user
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
   try {
      const user = await UserModel.findByIdAndDelete(req.params.id)
      await fs.promises.unlink(user.profilePhoto)
      return res.status(200).json({ success: true, message: `User ${req.params.id} deleted!` })
   } catch (err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: `User ${req.params.id} does not exist` })
   }
})

router.put(
   '/:id',
   generateID(''),
   verifyToken,
   createFileArray,
   temp.array('profilePhoto', 1),
   validateRequestBody(editUserSchema),
   checkForDuplicates,
   createToken('edit'),
   async (req, res) => {
      try {
         if (!Object.keys(req.body).length && !res.locals.files.length) throw 'Nothing to update'

         const oldUser = await UserModel.findById(req.params.id).lean()
         let newFilePath = undefined

         if (res.locals.decodedToken.email !== oldUser.email) throw 'Access Denied'

         if (!!res.locals.files.length) {
            newFilePath = res.locals.files[0].replace('temp', 'profile')
            await fs.promises.rename(res.locals.files[0], newFilePath)
         }

         
         const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, { email: req.body.email}).lean()

         const user = await {
            ...updatedUser,
            profilePhoto: await imageToBase64(updatedUser.profilePhoto)
         }

         return res.status(200).json({
            success: true,
            message: `User ${req.params.id} details edited`,
            user,
            token: res.locals.token
         })

      } catch (err) {
         await deleteFiles(res.locals.files)
         logger.error({ error: err })
         return res.status(404).json({ success: false, error: err })
      }
   }
)

// // Edit user
// router.put(
//    '/:id',
//    verifyToken,
//    createFileArray,
//    temp.array('profilePhoto', 1),
//    validateEditUser,
//    checkForDuplicates,
//    createToken,
//    async (req, res) => {
//       try {
//          const oldUser = await UserModel.findById(req.params.id)
//          let password,
//             profilePhoto,
//             document = {}

//          if (res.locals.decodedToken.email !== oldUser.email) throw 'Access denied'

//          if (req.body.password)
//             document.password = await bcrypt.hash(req.body.password, parseInt(PASSWORD_HASH_SALT_ROUNDS))

//          if (res.locals.files.length)
//             document.profilePhoto = res.locals.files[0]

//          if (res.locals.email)
//             document.email = req.body.email

//          const newUser = await UserModel.findByIdAndUpdate(req.params.id, document)

//          return res.status(200).json({
//             success: true,
//             message: 'Registration successful!',
//             user: {
//                ...newUser.toObject(),
//                profilePhoto: await imageToBase64(newUser.profilePhoto)
//             },
//             token: res.locals.token
//          })
//       } catch (err) {
//          logger.error({ error: err })
//          return res.status(404).json({ success: false, error: err })
//       }
//    }
// )

module.exports = router
