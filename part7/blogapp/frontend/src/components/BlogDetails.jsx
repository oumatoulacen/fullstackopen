import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import storage from "../services/storage";

const BlogDetails = ({ blogs, handleVote, handleDelete }) => {
  const { id } = useParams();
    const navigate = useNavigate();
  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  const handleLike = () => {
    handleVote(blog);
  };

  const handleRemove = () => {
    handleDelete(blog);
    navigate("/"); // Redirect to home after deletion
  };

  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user ? blog.user.name : "anonymous"}</div>
      {blog.user && blog.user.username === storage.me() && (
        <button onClick={handleRemove}>remove</button>
      )}
    </div>
 );
}

BlogDetails.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleVote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default BlogDetails;