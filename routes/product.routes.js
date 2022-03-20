const { Router } = require('express')
const ProductModel = require('../models/product.model')
const { validateRequestBody, checkForDuplicates, createPipeline, checkIfBodyEmpty } = require('../middleware/product.middleware')
const { generateID, createFileArray, checkForFiles } = require('../middleware/util')
const { verifyAdmin, verifyToken } = require('../middleware/auth')
const multer = require('multer')
const multerConfig = require('../config/multerConfig')
const logger = require('../utils/logger')
const imageToBase64 = require('../utils/imageToBase64')
const deleteFiles = require('../utils/deleteFiles')
const moveFiles = require('../utils/moveFiles')
const { createProductSchema, editProductSchema } = require('../schema/product.schema')

const router = Router()
const upload = multer(multerConfig('product'))
const uploadTemp = multer(multerConfig('temp'))

/**
 * - [x] create product
 * - [x] get all/search products
 * - [x] get single product
 * - [x] update product
 * - [x] delete product
 * - [ ] update product stock after purchase
 */

// Create product
router.post(
   '/create',
   verifyToken,
   verifyAdmin,
   generateID('product'),
   createFileArray,
   upload.array('photos', 4),
   checkForFiles,
   validateRequestBody(createProductSchema),
   checkForDuplicates,
   async (req, res) => {
      try {
         console.log(req.body)
         const document = {
            ...req.body,
            _id: res.locals.id,
            photos: res.locals.files
         }
         const product = await ProductModel.create(document)
         res.status(200).json({ success: true, message: 'Product Added', product })
      } catch (err) {
         await deleteFiles(res.locals.files)
         logger.error({ error: err })
         res.status(409).json({ success: false, error: err })
      }
   }
)

// Get all/Search Product | All Users
router.get('/', createPipeline, async (req, res) => {
   try {
      const temp = res.locals.pipeline.length > 0
         ? await ProductModel.aggregate(res.locals.pipeline)
         : await ProductModel.find().sort({ updatedAt: -1 }).lean()

      const result = await Promise.all(
         temp.map(async ({photos, ...product}) => ({
            ...product,
            photo: await imageToBase64(photos[0])
         }))
      )

      return res.status(200).json({
         success: true,
         message: "Here's all the products!",
         products: result,
         length: result.length
      })
   }
   catch(err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: err })
   }  
})

// Get single product| All Users
router.get('/:id', async (req, res) => {
   try {
      const product = await ProductModel.findById(req.params.id).lean()

      if (!product) throw 'No product found'

      const result = {
         ...product,
         // @ts-ignore
         photos: await Promise.all(product.photos.map(async file => await imageToBase64(file)))
      }

      return res.status(200).json({
         success: true,
         message: "Here's all the products!",
         product: result
      })
   }
   catch(err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: err })
   }  
})

// Update Product Info
router.put(
   '/:id',
   generateID(null),
   verifyToken,
   verifyAdmin,
   createFileArray,
   uploadTemp.array('photos', 4),
   checkIfBodyEmpty,
   validateRequestBody(editProductSchema),
   checkForDuplicates,
   async (req, res) => {
      try {
         const oldProduct = await ProductModel.findById(req.params.id).lean()
         let document = req.body

         if (res.locals.files.length) {
            // @ts-ignore
            await deleteFiles(oldProduct.photos)
            await moveFiles(res.locals.files, 'temp', 'product')
            document = { ...document, photos: res.locals.files.map(file => file.replace('temp', 'product')) }
         }

         const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, document, {
            lean: true,
            returnDocument: 'after'
         })

         const product = {
            ...updatedProduct,
            // @ts-ignore
            photos: await Promise.all(updatedProduct.photos.map(async file => await imageToBase64(file)))
         }

         return res.status(200).json({
            success: true,
            message: `Product ${req.params.id} details edited`,
            product
         })
      } catch (err) {
         await deleteFiles(res.locals.files)
         logger.error({ error: err })
         return res.status(404).json({ success: false, error: err })
      }
   }
)

// Delete single user
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
   try {
      const product = await ProductModel.findByIdAndDelete(req.params.id).lean()
      // @ts-ignore
      await deleteFiles(product.photos)
      return res.status(200).json({ success: true, message: `Product ${req.params.id} deleted!` })
   } catch (err) {
      logger.error({ error: err })
      return res.status(404).json({ success: false, error: `Product ${req.params.id} does not exist` })
   }
})

module.exports = router
