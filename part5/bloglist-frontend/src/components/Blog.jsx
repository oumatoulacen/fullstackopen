const Blog = ({ blog, view, setView }) => {
    const blogStyle = {
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 3
  }

  return view === blog.id ? (
    <div style={blogStyle}>
      <h5>{blog.title} </h5>
      <h5 className="italic">{blog.author}</h5>
      <h5>{blog.url}</h5>
      <h5>Likes: {blog.likes} <button>like</button> </h5>
    </div>
  ) :
  <div>
    <p>
      {blog.title} <span className="italic">{blog.author}</span><button onClick={() => setView(blog.id)}>view</button>
    </p>
  </div>
};

export default Blog