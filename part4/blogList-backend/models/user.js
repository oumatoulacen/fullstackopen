const mongoose = require("mongoose")


const userSchima = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4
    },
    name: String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ]
})

userSchima.set("toJSON", {
    transform: (doc, retObj) => {
        retObj.id = retObj._id.toString()
        delete retObj._id
        delete retObj.__v
        delete retObj.passwordHash
    }
})

const User = mongoose.model("User", userSchima)

module.exports = User