const fs = require('fs')
const UserModel = require('../models/user.model')
const { createUserSchema, loginUserSchema, editUserSchema } = require('../schema/user.schema')
const logger = require('../utils/logger')
const deleteFiles = require('../utils/deleteFiles')

const validateRequestBody = schema => async (req, res, next) => {
   try {
      await schema.parseAsync({ body: req.body })
      next()
   } catch (err) {
      if (res.locals.files && res.locals.files.length)
         await deleteFiles(res.locals.files)
      logger.error({ error: err })
      return res.status(400).json({ success: false, error: err })
   }
}

const checkForDuplicates = async (req, res, next) => {
   try {
      const email = req.body.email
      if (email) {
         const duplicateUser = await UserModel.findOne({ email })
         if (duplicateUser) throw 'A user with this email already exists!'
         next()
      }
      next()
   } catch (err) {
      if (res.locals.files && res.locals.files.length)
         await deleteFiles(res.locals.files)
      logger.error({ error: err })
      return res.status(400).json({ success: false, error: err })
   }
}

const checkUserExists = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) throw "User with this email does't exist"
      res.locals.user = user
      next()
   } catch (err) {
      logger.error({ error: err })
      return res.status(401).json({ success: false, error: err })
   }
}

const createPipeline = (req, res, next) => {
   const { query } = req
   let pipeline = []

   if (query.search_key && query.search_query)
      pipeline.push({
         $match: { [query.search_key]: { $regex: query.search_query, $options: 'i' } }
      })

   if (query.sort_key && (query.sort_order === '-1' || query.sort_order === '1'))
      pipeline.push({ $sort: { [query.sort_key]: parseInt(query.sort_order) } })

   res.locals.pipeline = pipeline
   next()
}


module.exports = {
   checkForDuplicates,
   checkUserExists,
   validateRequestBody,
   createPipeline
}
