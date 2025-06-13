const Blog = ({ blog }) => (
  <div>
    <a href={blog.url}>{blog.title}</a> | <span className="italic">{blog.author}</span>
  </div>  
)

export default Blog