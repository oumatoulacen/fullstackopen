const User = require("../models/user")
const info = require("./logger").info
const config = require("./config")
const jwt = require("jsonwebtoken")

const requestLogger = (request, response, next) => {
    info('Method:', request.method, 'Path:  ', request.path, 'Body:  ', request.body)
    info('---')
    next()
}

const userExtractor = async (request, response, next) => {
    const authorization = request.headers['authorization']
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = jwt.verify(authorization.substring(7), config.SECRET)
        const user = await User.findById(token.id)
        request.user = user
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: 'token missing or invalid' })
    }
    
    next(error)
}

module.exports = {
    requestLogger,
    userExtractor,
    unknownEndpoint,
    errorHandler
}