import type { Model, Types, Schema, SchemaDefinitionProperty } from 'mongoose'

type TProduct = {
   productId: SchemaDefinitionProperty<string>
   quantity: SchemaDefinitionProperty<number>
   refunded: SchemaDefinitionProperty<boolean>
}

type PurchaseDocument = {
   _id: SchemaDefinitionProperty<string>
   name: SchemaDefinitionProperty<string>
   userId: SchemaDefinitionProperty<string>
   products: SchemaDefinitionProperty<Types.Array<TProduct>>
   total: SchemaDefinitionProperty<number>
}

export const PurchaseSchema: Schema<PurchaseDocument, Model<PurchaseDocument, {}, {}, {}>, PurchaseDocument, any>

export const PurchaseModel: Model<PurchaseDocument, {}, {}, {}>
