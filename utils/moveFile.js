const fs = require('fs')

const moveFile = async (file, source, destination) => {
   const newFilePath = file.replace(source, destination)
   // newFilePath = res.locals.files[0].replace('temp', 'profile')
   await fs.promises.rename(file, newFilePath)
}

module.exports = moveFile