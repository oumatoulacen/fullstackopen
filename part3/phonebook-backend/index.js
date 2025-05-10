const express = require('express');
const json = require('body-parser');
const morgan = require('morgan');
const fs = require("fs");
const path = require("path"); 
// const cors = require('cors');

// helpers variables
const PORT = process.env.PORT || 3001;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Helper functions
const generateId = () => {
    const id = Math.floor(Math.random() * 1000000);
    return id.toString();
}
const findEntryById = (id) => {
    return phonebook.find(entry => entry.id === id);
}
const findEntryByName = (name) => {
    return phonebook.find(entry => entry.name.toLowerCase() === name.toLowerCase());
}
const findIndexById = (id) => {
    return phonebook.findIndex(entry => entry.id === id);
}


// Create an Express application(instance)
const app = express(); 

// Middlewares
// app.use(cors()); // Enable CORS for all routes
app.use(express.static('dist')); // Serve static files from the build directory
app.use(json.json()); // Parses JSON bodies
app.use(json.urlencoded({ extended: true })); // Parses URL-encoded bodies

morgan.token('body', (req) => { // Custom token to log the request body
    return JSON.stringify(req.body);
}
);
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    stream: accessLogStream, // Write logs to access.log file
    skip: (req, res) => {
        return req.method !== 'POST' && req.method !== 'PUT'; // Skip logging for other than POST and PUT requests
    }
}));
app.use(morgan('tiny', {
    skip: (req, res) => {
        return req.method === 'POST' || req.method === 'PUT'; // Skip logging for POST and PUT requests
    }
}));


// routes
app.get('/', (req, res) => {
    res.send('Welcome to the Phonebook API!');
});

app.get('/info', (req, res) => {
    const date = new Date();
    const entryCount = phonebook.length;
    res.send(`
        <p>Phonebook has info for ${entryCount} people</p>
        <p>${date}</p>
    `);
});

app.get('/api/persons', (req, res) => {
    res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const entry = findEntryById(id);
    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json({ message: 'Entry not found' });
    }
});

app.post('/api/persons', (req, res) => {
    const newEntry = req.body;

    if (!newEntry.name || !newEntry.number) {
        // 400 status code indicates a bad request
        return res.status(400).json({ message: 'Name and number are required' });
    }

    const existingEntry = findEntryByName(newEntry.name);
    if (existingEntry) {
        // 409 status code indicates a conflicts
        return res.status(409).json({ message: `Name ${newEntry.name} already exists` });
    }
    newEntry.id = generateId();
    phonebook.push(newEntry);
    res.status(201).json(newEntry); // 201 created
});

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const updatedEntry = req.body;
    const index = findIndexById(id);
    if (index !== -1) {
        phonebook[index] = { ...phonebook[index], ...updatedEntry };
        res.json(phonebook[index]);
    } else {
        res.status(404).json({ message: 'Entry not found' });
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const index = findIndexById(id);
    if (index !== -1) {
        phonebook.splice(index, 1);
        res.status(204).end(); // 204 No Content
    } else {
        res.status(404).json({ message: 'Entry not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
