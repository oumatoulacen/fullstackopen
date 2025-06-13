const blogRouter = require('express').Router()
const Blog = require('../models/blog')


blogRouter.get('/', async (request, response) => {
    const allBlogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(allBlogs)
})

blogRouter.post('/', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = new Blog({...request.body, user: user.id})
    
    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    const { id } = request.params 
    const user = request.user
    const blog = await Blog.findById(id)

    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'only the creator can delete this blog' })
    }
    
    user.blogs = user.blogs.filter(b => b.toString() !== id.toString())
    await user.save()
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