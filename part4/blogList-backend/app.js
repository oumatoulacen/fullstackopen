const express = require('express')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const middlware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(express.json())
app.use('/api/blogs', blogRouter)


// Middleware to handle unknown endpoints
app.use(middlware.unknownEndpoint)
// Middleware to handle errors
app.use(middlware.errorHandler)

module.exports = app