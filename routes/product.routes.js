const { Router } = require('express')
// const ProductModel = require('../models/product.model')
// const { validateProductBody } = require('../middleware/product.middleware')
// const generateId = require('../utils/generateId')
// const logger = require('../utils/logger')

const router = Router()

// router.post('/products', validateProductBody, async (req, res, next) => {
//    try {
//       console.log(res, req, next)
//       const doc = { ...req.body, _id: generateId('product') }
//       const product = await ProductModel.create(doc)
//       res.status(200).json({ success: true, message: 'Product Added! ヾ(≧▽≦*)o', product })
//    } catch (err) {
//       logger.error({ error: err })
//       res.status(409).json({ success: false, error: err })
//    }
// })

module.exports = router
