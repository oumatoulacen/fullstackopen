require('dotenv').config() // include this first (to insure env variables are loaded) before other modules
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/persons')


const app = express()
// middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

app.use(morgan('tiny', {
    skip: (req, res) => {
        return req.method === 'POST'
    }
}))
// custom token to log request body
morgan.token('body', (req) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[name-length] - :response-time ms :body', {
    skip: (req, res) => {
        return req.method !== 'POST'
    }
}))

// error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// routes
app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend</h1>')
})

app.get('/api/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            const date = new Date()
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${date}</p>
            `)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(Persons => {
            response.json(Persons)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({ error: 'number missing' })
    } else if (!body.name) {
        return response.status(400).json({ error: 'name missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
        
    person.save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(Person => {
            if (Person) {
                return response.json(Person)
            } else {
                return response.status(404).json({ error: 'person not found' })
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(() => {
            return response.status(204).json()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    const body = request.body

    Person.findById(id)
        .then(Person => {
            if (!Person) {
                return response.status(404).json({ error: 'person not found' })
            }
            Person.name = body.name
            Person.number = body.number
            return Person.save()
        })
        .then(updatedPerson => {
            return response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// middleware to handle unknown endpoints
app.use(unknownEndpoint)
// middleware  to handle errors
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})