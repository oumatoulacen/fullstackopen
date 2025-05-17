const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const resp = await Blog.find({})
    response.json(resp)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const result = await blog.save()

    response.status(201).json(result)
})

module.exports = blogRouter