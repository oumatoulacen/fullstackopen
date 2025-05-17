const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const mongoose = require("mongoose")



const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  }
]

const api = supertest(app)

test('dummy returns one', () => {
  const initialBlogs = []

  const result = listHelper.dummy(initialBlogs)
  assert.strictEqual(result, 1)
})

describe('total Likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([initialBlogs[0]])
    assert.strictEqual(result, initialBlogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(initialBlogs.slice(0, 3))
    assert.strictEqual(result, initialBlogs[0].likes + initialBlogs[1].likes + initialBlogs[2].likes)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('when list has only one blog, equals that blog', () => {
    const result = listHelper.favoriteBlog([initialBlogs[0]])
    assert.deepStrictEqual(result, initialBlogs[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(initialBlogs)
    assert.deepStrictEqual(result, initialBlogs[2])
  })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('HTTP GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)
    assert.ok(titles.includes('React patterns'))
  })

  test("that the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs")
    assert.ok(response.body[0].id)
  })
})

describe.only('HTTP POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert.ok(titles.includes('First class tests'))
  })

  test('a blog without likes defaults to 0', async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, 0)
    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map(b => b.title)
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1)
    assert.ok(titles.includes('First class tests'))
  })

  test("a blog without title and url is not added", async () => {
    const newBlog = {
      title: "First class tests",
      likes: 12,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })
})

after(async () => {
  mongoose.connection.close()
})