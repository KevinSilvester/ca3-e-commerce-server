const { Schema, model } = require('mongoose')

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

const ProductSchema = new Schema(
   {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      brand: { type: String, required: true },
      price: { type: Number, required: true, min: 0.01 },
      inStock: { type: Boolean, required: true },
      category: { type: String, required: true, enum: ['jacket', 't-shirt', 'pant', 'hoodie'] },
      stock: StockSchema,
      description: { type: String, required: true },
      gender: { type: String, required: true, enum: ['men', 'women', 'unisex'] }
   },
   {
      timestamps: true,
      collection: 'products',
      versionKey: false
   }
)

module.exports = model('Product', ProductSchema)
