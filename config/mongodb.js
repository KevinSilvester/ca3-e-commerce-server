const mongoose = require('mongoose')
const logger = require('../utils/logger')

const mongodb = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI)
      logger.info('Connected to MongoDB Atlas')
   } catch (err) {
      logger.fatal('MongoDB Atlas connection failed!' + err)
      process.exit(1)
   }
}

module.exports = mongodb
