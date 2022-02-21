const fs = require('fs')
const UserModel = require('../models/user.model')
const { createUserSchema, loginUserSchema } = require('../schema/user.schema')
const generateId = require('../utils/generateId')
const logger = require('../utils/logger')

const generateUserID = (req, res, next) => {
   res.locals.files = []
   res.locals.id = generateId('user')
   next()
}

const validateUserFiles = (req, res, next) => {
   if (!req.files.length && !res.locals.files.length)
      res.status(406).json({ success: false, error: 'No profile photo provided' })
   else
      next()
}

const validateCreateUser = async (req, res, next) => {
   try {
      await createUserSchema.parseAsync({ body: req.body })
      next()
   } catch (err) {
      await Promise.all(
         res.locals.files.map(async file => {
            fs.unlink(file, err => {
               if (err) logger.error({ error: err })
            })
         })
      )
      logger.error({ error: err })
      res.status(406).json({ success: false, error: err })
   }
}

const checkForDuplicates = async (req, res, next) => {
   try {
      const duplicateUser = await UserModel.findOne({ email: req.body.email })
      if (duplicateUser) 
         throw 'A user with this email already exists!'
      else 
         next()
   } catch (err) {
      await Promise.all(
         res.locals.files.map(async file => {
            fs.unlink(file, err => {
               if (err) logger.error({ error: err })
            })
         })
      )
      logger.error({ error: err })
      res.status(400).json({ success: false, error: err })
   }
}

const validateLoginUser = async (req, res, next) => {
   try {
      await loginUserSchema.parseAsync({ body: req.body })
      next()
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
}

const checkUserExists = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email })
      res.locals.user = user
      if (!user) 
         throw 'User with this email does\'t exist'
      else 
         next()
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
}

module.exports = {
   generateUserID,
   validateCreateUser,
   validateUserFiles,
   checkForDuplicates,
   validateLoginUser,
   checkUserExists
}
