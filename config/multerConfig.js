const multer = require('multer')
const generateId = require('../utils/generateId')

const multerConfig = subDirName => {
   const fullDirName = `./${process.env.IMAGE_UPLOAD_FOLDER}/${subDirName}/`

   const getFileName = (req, file) =>
      `${req.res.locals.id}-${req.files?.length || 1}.${file.mimetype.split('/')[1]}`

   return {
      fileFilter: (req, file, cb) => {
         if (/image\/(png|jp(eg|g))/.test(file.mimetype)) {
            cb(null, true)
         } else {
            cb(null, false)
            req.res.status(406).json({ success: false, error: 'Only .png, .jpg and .jpeg format allowed!' })
         }
      },
      storage: multer.diskStorage({
         destination: fullDirName,
         filename: (req, file, cb) => {
            const fileName = getFileName(req, file)
            req.res.locals.files.push(`${fullDirName}${fileName}`)
            cb(null, fileName)
         }
      })
   }
}

module.exports = multerConfig
