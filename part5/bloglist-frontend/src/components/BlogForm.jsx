import blogService from '../services/blogs'

function BlogForm({setBlogs, notify}) {
    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const newBlog = {
            title: form.title.value,
            author: form.author.value,
            url: form.url.value,
            likes: form.likes.value ? parseInt(form.likes.value) : 0
        }
        try {
            const createdBlog = await blogService.create(newBlog)
            setBlogs(blogs => [...blogs, createdBlog])
            console.log('Blog created:', createdBlog)
            notify(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, "success")

            form.reset() // Reset the form after submission
        } catch (error) {
            notify('Error creating blog', 'error')
            console.error('Error creating blog:', error)
        }
    }

    return <>
        <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" />
            </div>
            <div>
                <label htmlFor="author">Author:</label>
                <input type="text" id="author" name="author" />
            </div>
            <div>
                <label htmlFor="url">URL:</label>
                <input type="text" id="url" name="url" />
            </div>
            <div>
                <label htmlFor="likes">Likes:</label>
                <input type="number" id="likes" name="likes" defaultValue="0" />
            </div>
            <button type="submit">Create</button>
        </form>
    </>
}

export default BlogForm