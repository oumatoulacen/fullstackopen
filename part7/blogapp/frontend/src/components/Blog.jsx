import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <div className="blog">
      <Link to={`/blogs/${blog.id}`} style={{ textDecoration: "none", color: "#333" }}>
        <h3>{blog.title} by {blog.author}</h3>
      </Link>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object,
  }).isRequired
};

export default Blog;
