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

// seed some data
// const seedData = [
//     { name: 'Arto Hellas', number: '040-123456' },
//     { name: 'Ada Lovelace', number: '39-44-5323523' },
//     { name: 'Dan Abramov', number: '12-43-234345' },
//     { name: 'Mary Poppendieck', number: '39-23-6423122' }
// ]
// console.log('Seeding database with initial data...')
// Person.insertMany(seedData).then(() => {
//     console.log('Database seeded successfully.')
// }
// ).catch((error) => {
//     console.error('Error seeding database:', error)
// })


// routes
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(Persons => {
            response.json(Persons)
        })
        .catch(error => {
            console.error(error)
            response.status(500).send({ error: 'something went wrong' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.number) {
        return response.status(400).json({ error: 'number missing' })
    } else if (!body.name) {
        return response.status(400).json({ error: 'name missing' })
    }

    // ... check if name already exists in case request is made outside of the browser

    const person = new Person({
        name: body.name,
        number: body.number
    })
        
    person.save()
        .then(savedPerson => {
            return response.json(savedPerson)
        })
        .catch(error => {
            console.error(error)
            return response.status(500).send({ error: 'something went wrong' })
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(Person => {
            return response.json(Person)
        })
        .catch(error => {
            console.log(error)
            return response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(() => {
            return response.status(204).end()
        })
        .catch(error => {
            console.error(error)
            return response.status(400).send({ error: 'malformatted id' })
        })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})