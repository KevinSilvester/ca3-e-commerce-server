const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
   {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
      accessLevel: {
         type: Number,
         required: true,
         default: parseInt(process.env.ACCESS_LEVEL_NORMAL_USER)
      },
      profilePhoto: { type: String, required: true },
      cart: [{ type: String, required: false }],
      purchaseHistory: [{ type: String, required: false }]
   },
   {
      timestamps: true,
      collection: 'users',
      versionKey: false
   }
)

module.exports = model('User', UserSchema)
