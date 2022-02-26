// @ts-check
const { bodySchema } = require('../schema/product.schema')
const logger = require('../utils/logger')

/**
 * @type {typeof import('@middleware/product.middleware').validateProductBody} 
 */
const validateProductBody = async (req, res, next) => {
  try {
    await bodySchema.parseAsync({ body: req.body })
    await next()
  } catch (err) {
    logger.error({ error: err })
    res.status(406).json({ success: false, error: err })
  }
}

module.exports = { validateProductBody }
