import blogService from "../services/blogs";

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
      };

      const updatedBlog = await blogService.like(id, newBlog);
      setBlogs((blogs) =>
        blogs.map((blog) => (blog.id === id ? updatedBlog : blog))
      );
      notify(`You liked "${updatedBlog.title}"`, "success");
    } catch (error) {
      notify("Error liking blog", "error");
    }
  };

  return view === blog.id ? (
    <div style={blogStyle}>
      <h5>{blog.title} <span className="italic">{blog.author}</span> <button onClick={() => setView(null)}>hide</button></h5>
      <h5>{blog.url}</h5>
      <h5>Likes: {blog.likes} <button onClick={() => handleLike(blog.id)}>like</button> </h5>
      <h5>Added By {blog.user.name}</h5>
    </div>
  ) :
  <div>
    <p>
      {blog.title} <span className="italic">{blog.author} </span><button onClick={() => setView(blog.id)}>view</button>
    </p>
  </div>
};

export default Blog