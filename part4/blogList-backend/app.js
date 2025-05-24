require('express-async-errors')
const mongoose = require('mongoose')
const express = require('express')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const middlware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB', config.MONGODB_URI)
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })


app.use(express.json())
app.use(middlware.requestLogger)

app.use('/api/blogs', middlware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)


// Middleware to handle unknown endpoints
app.use(middlware.unknownEndpoint)
// Middleware to handle errors
app.use(middlware.errorHandler)

module.exports = app