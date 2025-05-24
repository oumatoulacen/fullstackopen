const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require("mongoose")
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
    {
        username: "root",
        name: "admin",
        password: "passwd"
    },
    {
        username: "root1",
        name: "admin1",
        password: "passwd1"
    }
]

beforeEach(async () => {
    await User.deleteMany()
    await User.insertMany(initialUsers)
})

describe("HTTP GET /api/users", () => {
    test("users are returned as json", async () => {
        await api.get("/api/users/")
            .expect(200)
            .expect("Content-Type", /application\/json/)
    })

    test("all users are returned as json", async () => {
        const usersInDB = await User.find({})
        assert.strictEqual(initialUsers.length, usersInDB.length)
    })

})

describe("HTTP POST /api/users", () => {
    test("a valid user can be added", async () => {
        const newUser = {
            username: "root2",
            name: "admin2",
            password: "passwd2"
        }
        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        const usersInDB = await User.find({})
        const usernames = usersInDB.map(user => user.username)

        assert.strictEqual(usersInDB.length, initialUsers.length + 1)
        assert.strictEqual(usernames.includes(newUser.username), true)
    })

    test("a user with invalid username is not added", async () => {
        const newUser = {
            username: "ro",
            name: "admin2",
            password: "passwd2"
        }
        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)

        const usersInDB = await User.find({})
        assert.strictEqual(usersInDB.length, initialUsers.length)
    })

    test("a user with invalid password is not added", async () => {
        const newUser = {
            username: "root2",
            name: "admin2",
            password: "pw"
        }
        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        const usersInDB = await User.find({})
        assert.strictEqual(usersInDB.length, initialUsers.length)
    })
})

after(async () => {
    mongoose.connection.close()
})