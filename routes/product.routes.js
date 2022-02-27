const { Router } = require('express')
const ProductModel = require('../models/product.model')
const { validateRequestBody, checkForDuplicates } = require('../middleware/product.middleware')
const { generateID, createFileArray, checkForFiles } = require('../middleware/util')
const { verifyAdmin, verifyToken } = require('../middleware/auth')
const multer = require('multer')
const multerConfig = require('../config/multerConfig')
const logger = require('../utils/logger')
const imageToBase64 = require('../utils/imageToBase64')
const deleteFiles = require('../utils/deleteFiles')
const moveFiles = require('../utils/moveFiles')
const { createProductSchema } = require('../schema/product.schema')

const router = Router()
const upload = multer(multerConfig('product'))
const uploadTemp = multer(multerConfig('temp'))

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

module.exports = router
