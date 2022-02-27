import type { Model, Types, Schema, SchemaDefinitionProperty } from 'mongoose'

type UserDocument = {
   _id: SchemaDefinitionProperty<string>
   name: SchemaDefinitionProperty<string>
   email: SchemaDefinitionProperty<string>
   password: SchemaDefinitionProperty<string>
   accessLevel: SchemaDefinitionProperty<number>
   profilePhoto: SchemaDefinitionProperty<string>
   cart: SchemaDefinitionProperty<Types.Array<string>>
   purchaseHistory: SchemaDefinitionProperty<Types.Array<string>>
}

export const UserSchema: Schema<UserDocument, Model<UserDocument, {}, {}, {}>, UserDocument, any>

export const UserModel: Model<UserDocument, {}, {}, {}>
