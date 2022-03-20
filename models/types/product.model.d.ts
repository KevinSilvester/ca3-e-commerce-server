import type { Model, Types, Schema, SchemaDefinitionProperty } from 'mongoose'

type StockSubdocument = {
   XS: SchemaDefinitionProperty<number>
   S: SchemaDefinitionProperty<number>
   M: SchemaDefinitionProperty<number>
   L: SchemaDefinitionProperty<number>
   XL: SchemaDefinitionProperty<number>
   XXL: SchemaDefinitionProperty<number>
}

export const StockSchema: Schema<StockSubdocument, Model<StockSubdocument, {}, {}, {}>, StockSubdocument, any>

type ProductDocument = {
   _id: SchemaDefinitionProperty<string>
   name: SchemaDefinitionProperty<string>
   brand: SchemaDefinitionProperty<string>
   price: SchemaDefinitionProperty<number>
   inStock: SchemaDefinitionProperty<boolean>
   category: SchemaDefinitionProperty<'jacket' | 't-shirt' | 'pant' | 'hoodie'>
   stock: SchemaDefinitionProperty<number>
   description: SchemaDefinitionProperty<string>
   gender: SchemaDefinitionProperty<'men' | 'women' | 'unisex'>
   photos: SchemaDefinitionProperty<Types.Array<string>>
}

export const ProductSchema: Schema<ProductDocument, Model<ProductDocument, {}, {}, {}>, ProductDocument, any>

export const ProductModel: Model<ProductDocument, {}, {}, {}>
