// @ts-check
const cloudinary = require('../config/cloudinary')
const logger = require('../utils/logger')

/**
 * @param {string} base64
 * @param {string} imageName
 * @param {string} destination
 */
const imageUpload = async (base64, imageName, destination) => {
   try {
      const res = await cloudinary.uploader.upload(base64, {
         public_id: imageName,
         // upload_preset: process.env.CLOUDINARY_NAME,
         folder: `${process.env.CLOUDINARY_NAME}/${destination}`
      })
      logger.info('Image uploaded')
   } catch (err) {
      logger.error('Image upload failed: ', err)
   }
}

module.exports = imageUpload
