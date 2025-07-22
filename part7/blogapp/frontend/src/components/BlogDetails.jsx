import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";

import storage from "../services/storage";
import blogService from "../services/blogs";

const BlogDetails = ({ blogs, handleVote, handleDelete, setBlogs, notify }) => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const blog = blogs.find(b => b.id === id);

  const addCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() === "") {
      return;
    }
    blogService.addComment(blog.id, comment)
      .then(updatedBlog => {
        notify("Comment added successfully");
        dispatch(setBlogs(blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b))));
      })
      .catch(error => {
        notify("Failed to add comment");
      })
      .finally(() => {
        setComment(""); // Clear the comment input after submission
      });
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  
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
      <h3>Comments</h3>
      <form onSubmit={addCommentSubmit}>
        <input type="text" name="comment" placeholder="Add a comment" required value={comment} onChange={handleCommentChange} />
        <button type="submit">Add Comment</button>
      </form>
      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
}

BlogDetails.propTypes = {
  blogs: PropTypes.array.isRequired,
  handleVote: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
};

export default BlogDetails;