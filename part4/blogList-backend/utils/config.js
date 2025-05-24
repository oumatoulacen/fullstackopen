require("dotenv").config()

const PORT = process.env.PORT || 3003

let SALT_ROUNDS = 10
if (process.env.NODE_ENV === 'test') {
    SALT_ROUNDS = 1
}

const SECRET = process.env.SECRET || 'secret key'

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI


vars = {
    PORT,
    MONGODB_URI,
    SALT_ROUNDS,
    SECRET
}

module.exports = vars