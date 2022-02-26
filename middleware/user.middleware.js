// @ts-check
// @ts-ignore
const fs = require('fs')
const UserModel = require('../models/user.model')
const logger = require('../utils/logger')
const deleteFiles = require('../utils/deleteFiles')

/**
 * @type {typeof import('@middleware/user.middleware').validateRequestBody} 
 */
const validateRequestBody = schema => async (req, res, next) => {
   try {
      await schema.parseAsync({ body: req.body })
      next()
   } catch (err) {
      if (res.locals.files && res.locals.files.length) await deleteFiles(res.locals.files)
      console.log('here')
      logger.error({ error: err })
      res.status(400).json({ success: false, error: err })
   }
}

/**
 * @type {typeof import('@middleware/user.middleware').checkForDuplicates} 
 */
const checkForDuplicates = async (req, res, next) => {
   try {
      const email = req.body.email
      if (email) {
         const duplicateUser = await UserModel.findOne({ email })
         if (duplicateUser) throw 'A user with this email already exists!'
         else next()
      } else next()
   } catch (err) {
      if (res.locals.files && res.locals.files.length) await deleteFiles(res.locals.files)
      logger.error({ error: err })
      res.status(400).json({ success: false, error: err })
   }
}

/**
 * @type {typeof import('@middleware/user.middleware').checkUserExists} 
 */
const checkUserExists = async (req, res, next) => {
   try {
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) throw "User with this email does't exist"
      res.locals.user = user
      next()
   } catch (err) {
      logger.error({ error: err })
      res.status(401).json({ success: false, error: err })
   }
}

/**
 * @type {typeof import('@middleware/user.middleware').checkIfBodyEmpty} 
 */
const checkIfBodyEmpty = (req, res, next) => {
   if (!Object.keys(req.body).length && !res.locals.files.length)
      res.status(400).json({ success: false, error: 'Nothing to update' })
   else 
      next()
}

/**
 * @type {typeof import('@middleware/user.middleware').createPipeline} 
 */
const createPipeline = (req, res, next) => {
   const { query } = req
   let pipeline = []

   if (query.search_key && query.search_query)
      pipeline.push({
         $match: { [query.search_key.toString()]: { $regex: query.search_query, $options: 'i' } }
      })

   if (query.sort_key && (query.sort_order === '-1' || query.sort_order === '1'))
      pipeline.push({ $sort: { [query.sort_key.toString()]: parseInt(query.sort_order) } })

   res.locals.pipeline = pipeline
   next()
}

module.exports = {
   checkForDuplicates,
   checkUserExists,
   validateRequestBody,
   checkIfBodyEmpty,
   createPipeline
}
