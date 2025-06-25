import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, view, setView, notify }) => {
  const blogStyle = {
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3
  }

  const handleLike = async (id) => {
    try {
      const newBlog = {
        likes: blog.likes + 1,
        user: blog.user.id,
        title: blog.title,
        author: blog.author,
        url: blog.url
      }

      const updatedBlog = await blogService.like(id, newBlog)
      setBlogs((blogs) =>
        blogs.map((blog) => (blog.id === id ? updatedBlog : blog))
      )
      notify(`You liked "${updatedBlog.title}"`, 'success')
    } catch (error) {
      notify('Error liking blog', 'error')
    }
  }

  const handleRemove = async (id) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs((blogs) => blogs.filter((blog) => blog.id !== id))
        notify(`Blog "${blog.title}" removed`, 'success')
      } catch (error) {
        notify('Error removing blog', 'error')
      }
    }
  }

  return view === blog.id ? (
    <div style={blogStyle}>
      <h5>{blog.title} <span className="italic">{blog.author}</span> <button className="hide" onClick={() => setView(null)}>Hide</button></h5>
      <h5>{blog.url}</h5>
      <h5>Likes: {blog.likes} <button className="like" onClick={() => handleLike(blog.id)}>Like</button> </h5>
      <h5>Added By {blog.user.name}</h5>
      {blog.user && blog.user.username === JSON.parse(window.localStorage.getItem('loggedUserInfo')).username &&
        <button className='remove' onClick={() => handleRemove(blog.id)}>Remove</button>
      }
    </div>
  ) : (
    <div>
      <p>
        {blog.title} <span className="italic">{blog.author} </span><button className="view" onClick={() => setView(blog.id)}>View</button>
      </p>
    </div>
  )
}

export default Blog