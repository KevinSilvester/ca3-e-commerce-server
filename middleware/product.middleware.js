// @ts-check
const ProductModel = require('../models/product.model')
const deleteFiles = require('../utils/deleteFiles')
const logger = require('../utils/logger')

/**
 * @param {import('zod').AnyZodObject} schema
 * @returns {(
 *    req: import('express').Request,
 *    res: import('express').Response,
 *    next: import('express').NextFunction) => Promise<void>}
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
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// prettier-ignore
const checkForDuplicates = async (req, res, next) => {
   try {
      const { name, brand, prevName, prevBrand } = req.body

      if (name && brand) {
         const duplicateProduct = await ProductModel.findOne({ name, brand })
         if (duplicateProduct) throw 'A product with this name and brand already exists!'
         else next()
      }
      else if (name && !brand) {
         const duplicateProduct = await ProductModel.findOne({ name, brand: prevBrand })
         if (duplicateProduct) throw 'A product with this name and brand already exists!'
         else next()
      } 
      else if (!name && brand) {
         const duplicateProduct = await ProductModel.findOne({ name: prevName, brand })
         if (duplicateProduct) throw 'A product with this name and brand already exists!'
         else next()
      }
      else next()
   } catch (err) {
      if (res.locals.files && res.locals.files.length) await deleteFiles(res.locals.files)
      logger.error({ error: err })
      res.status(400).json({ success: false, error: err })
   }
}

module.exports = { validateRequestBody, checkForDuplicates }
