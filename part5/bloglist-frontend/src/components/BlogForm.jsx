import { useState } from 'react'
import blogService from '../services/blogs'

function BlogForm({setBlogs, notify, blogFormRef}) {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [url, setUrl] = useState("")
    const [likes, setLikes] = useState(0)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const newBlog = {
            title,
            author,
            url,
            likes
        }
        try {
            const createdBlog = await blogService.create(newBlog)
            setBlogs(blogs => [...blogs, createdBlog])
            notify(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, "success")
            blogFormRef.current.toggleVisibility() // Hide the form after submission
        } catch (error) {
            notify('Error creating blog', 'error')
        }
        setTitle("")
        setAuthor("")
        setUrl("")
        setLikes(0)
    }

    return <>
        <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
                <label htmlFor="author">Author:</label>
                <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
            <div>
                <label htmlFor="url">URL:</label>
                <input type="text" id="url" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
            <div>
                <label htmlFor="likes">Likes:</label>
                <input type="number" id="likes" value={likes} onChange={e => setLikes(parseInt(e.target.value) || 0)} />
            </div>
            <button type="submit" className='create'>Create</button>
        </form>
    </>
}

export default BlogForm