const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
require('dotenv').config({ path: './config/.env' })

const logger = require('./utils/logger')
const imageUpload = require('./utils/imageUpload')
const mongodb = require('./config/mongodb')

const productRoutes = require('./routes/product.routes')
const userRoutes = require('./routes/users.routes')

const app = express()
const port = process.env.PORT || 4000
// const add

app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

app.listen(port, '127.0.0.1', async () => {
   logger.info(`Server running at http://localhost:${port} or http://127.0.0.1:${port}`)
   // await imageUpload(base64, 'test', 'user-profile')
   await mongodb()
})
