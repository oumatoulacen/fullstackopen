const userRouter = require("express").Router()
const bcrypt = require("bcrypt")
const config = require("../utils/config")
const User = require("../models/user")

userRouter.get("/", async (req, res) => {
    const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1, likes: 1 })
    res.json(users)
})

userRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body

    if (!password || password.length < 3) {
        return res.status(400).json({ error: "password is required to be at least 3 chars"})
    }

    const passwordHash = await bcrypt.hash(password, config.SALT_ROUNDS)
    const user = new User({
        username, name, passwordHash
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
})

module.exports = userRouter