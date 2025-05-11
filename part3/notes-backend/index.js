require('dotenv').config() // include this first (to insure env variables are loaded) before other modules
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Note = require('./models/notes')


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
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req, res) => {
        return req.method !== 'POST'
    }
}))

// routes
app.get('/api/notes', (request, response) => {
    Note.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => {
      console.error(error)
      response.status(500).send({ error: 'something went wrong' })
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => {
      console.error(error)
      response.status(500).send({ error: 'something went wrong' })
    })
})

app.get('/api/notes/:id', (request, response) => {
    Note.findById(request.params.id)
    .then(note => {
      response.json(note)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => {
            console.error(error)
            response.status(400).send({ error: 'malformatted id' })
        })
    response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    const note = {
        important: !body.important,
    }

    Note.findByIdAndUpdate(id, note, { new: true})
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => {
            console.error(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})