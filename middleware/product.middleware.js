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

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
 const checkIfBodyEmpty = (req, res, next) => {
   !Object.keys(req.body).length && !res.locals.files.length
      ? res.status(400).json({ success: false, error: 'Nothing to update' })
      : next()
}

/**
 * @typedef {import('./product.middleware.types').QueryTypes} QueryTypes
 * @param {import('express').Request<{}, {}, {}, QueryTypes>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const createPipeline = (req, res, next) => {
   const { query } = req
   let pipeline = []

   if (query.search_query)
      pipeline.push({
         $search: {
            index: process.env.MONGO_SEARCH_INDEX,
            compound: {
               should: [
                  {
                     text: {
                        query: query.search_query,
                        path: 'name',
                        score: { boost: { value: 10 } }
                     }
                  },
                  {
                     text: {
                        query: query.search_query,
                        path: ['brand', 'description', 'category', 'gender']
                     }
                  }
               ]
            }
         }
      })

   if (req.query.filter_brand && req.query.filter_brand.length)
      pipeline.push({
         $match: {
            brand: { $in: req.query.filter_brand }
         }
      })

   if (req.query.filter_category && req.query.filter_category.length)
      pipeline.push({
         $match: {
            category: { $in: req.query.filter_category }
         }
      })

   if (req.query.filter_gender && req.query.filter_gender.length)
      pipeline.push({
         $match: {
            gender: { $in: req.query.filter_gender }
         }
      })

   if (req.query.filter_price_min)
      pipeline.push({
         $match: {
            price: { $gte: parseInt(req.query.filter_price_min) }
         }
      })

   if (req.query.filter_price_max)
      pipeline.push({
         $match: {
            price: { $lte: parseInt(req.query.filter_price_max) }
         }
      })
   
   if (query.sort_key && (query.sort_order === '-1' || query.sort_order === '1'))
      pipeline.push({ $sort: { [query.sort_key]: parseInt(query.sort_order) } })

   console.log(pipeline)

   
   res.locals.pipeline = pipeline
   next()
}

module.exports = { validateRequestBody, checkForDuplicates, createPipeline, checkIfBodyEmpty }
