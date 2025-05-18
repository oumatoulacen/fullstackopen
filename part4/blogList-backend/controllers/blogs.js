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

blogRouter.delete('/:id', async (request, response) => {
    const { id } = request.params
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
    const { id } = request.params
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {
        new: true,
        runValidators: true,
        context: 'query'
    })
    response.status(200).json(updatedBlog)
})

module.exports = blogRouter