// @ts-check
const multer = require('multer')

/**
 * @param {import('express').Request} req 
 * @param {Express.Multer.File} file
 * @returns {string}
 */
const getFileName = (req, file) =>
   `${req.res.locals.id}-${req.files?.length}.${file.mimetype.split('/')[1].replace('e', '')}`

/**
 * @param {string} subDirName 
 * @returns {import('multer').Options}
 */
const multerConfig = subDirName => {
   const fullDirName = `./${process.env.IMAGE_UPLOAD_FOLDER}/${subDirName}/`

   return {
      fileFilter: (req, file, cb) => {
         if (/image\/(png|jp(eg|g))/.test(file.mimetype)) {
            cb(null, true)
         } else {
            cb(null, false)
            req.res
               .status(406)
               .json({ success: false, error: 'Only .png, .jpg and .jpeg format allowed!' })
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
