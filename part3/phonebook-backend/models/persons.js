const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

// console.log('connecting to', url)
mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required ma man'],
    minLength: 3,
    maxLength: 50,
    validate: {
      validator: function (v) {
        return /^[_a-zA-Z\s]+$/.test(v)
      },
      message: props => `${props.value} is not a valid name!`
    }
  },
  number: {
    type: String,
    required: [true, 'really! have you seen a phonebook without a number?'],
    minLength: 8,
    maxLength: 20,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d+/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)