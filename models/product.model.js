// @ts-check
const { Schema, model } = require('mongoose')

/**
 * @type {typeof import('./types/product.model').StockSchema}
 */
const StockSchema = new Schema(
   {
      XS: { type: Number, required: true, min: 0 },
      S: { type: Number, required: true, min: 0 },
      M: { type: Number, required: true, min: 0 },
      L: { type: Number, required: true, min: 0 },
      XL: { type: Number, required: true, min: 0 },
      XXL: { type: Number, required: true, min: 0 }
   },
   { _id: false }
)

/**
 * @type {typeof import('./types/product.model').ProductSchema}
 */
const ProductSchema = new Schema(
   {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      price: { type: Number, required: true, min: 0.01 },
      inStock: { type: Boolean, required: true },
      category: { type: String, required: true, enum: ['jacket', 't-shirt', 'pant', 'hoodie'] },
      stock: { type: Number, required: true, min: 0 },
      description: { type: String, required: true },
      gender: { type: String, required: true, enum: ['men', 'women', 'unisex'] },
      photos: { type: [String], required: true }
   },
   {
      timestamps: true,
      collection: 'products',
      versionKey: false
   }
)

/**
 * @type {typeof import('./types/product.model').ProductModel}
 */
const ProductModel = model('Product', ProductSchema)

module.exports = ProductModel
