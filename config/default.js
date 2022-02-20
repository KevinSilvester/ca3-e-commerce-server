module.exports = {
   port: process.env.PORT || 4000,
   mongoUri: process.env.MONGO_URI,
   cloudinary: {
      name: process.env.CLOUDINARY_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
   },
   accessLevel: {
      guest: process.env.ACCESS_LEVEL_GUEST,
      normalUser: process.env.ACCESS_LEVEL_NORMAL_USER,
      admin: process.env.ACCESS_LEVEL_ADMIN
   }
}
