require('dotenv').config() // include this first (to insure env variables are loaded) before other modules
const Person = require('./models/persons')


// seed some data
const seedData = [
    { name: 'John Doe', number: '123-456-7890' },
    { name: 'Jane Smith', number: '987-654-3210' },
    { name: 'Alice Johnson', number: '555-555-5555' },
    { name: 'Bob Brown', number: '444-444-4444' },
    { name: 'Charlie Black', number: '333-333-3333' }
]

console.log('Seeding database with initial data...')
Person.insertMany(seedData)
    .then(() => { console.log('Database seeded successfully.') })
    .catch((error) => { error('Error seeding database:', error) })
    .finally(() => {
        console.log('Seeding process completed.')
        process.exit(0)
    })