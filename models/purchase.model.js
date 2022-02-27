// @ts-check
const { Schema, model } = require('mongoose')

/**
 * @type {typeof import('./purchase.model').PurchaseSchema}
 */
const PurchaseSchema = new Schema(
   {
      _id: { type: String, required: true },
      userId: { type: String, required: false },
      products: [
         {
            productId: { type: String, required: true },
            quantity: { type: Number, required: true, min: 0 },
            refunded: { type: Boolean, required: true }
         }
      ],
      total: { type: Number, required: true }
   },
   {
      timestamps: true,
      collection: 'purchases',
      versionKey: false
   }
)

/**
 * @type {typeof import('./purchase.model').PurchaseModel}
 */
const PurchaseModel = model('Purchase', PurchaseSchema)

module.exports = PurchaseModel
