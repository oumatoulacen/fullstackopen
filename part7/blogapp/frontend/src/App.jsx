import { useState, useEffect, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotification, clearNotification } from "./reducers/notificationReducer";
import { setBlogs, addBlog, updateBlog, removeBlog } from "./reducers/blogsReducer";

import blogService from "./services/blogs";
import loginService from "./services/login";
import storage from "./services/storage";
import Login from "./components/Login";
import Blog from "./components/Blog";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [user, setUser] = useState(null);
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const blogFormRef = createRef();

  const notify = (message, type = "success") => {
    dispatch(setNotification({ message, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      setUser(user);
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
    } catch (error) {
      notify("Wrong credentials", "error");
    }
  };

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog);
    dispatch(addBlog(newBlog));
    console.log("new blog", newBlog);
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const handleVote = async (blog) => {
    console.log("updating", blog);
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });

    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    dispatch(updateBlog(updatedBlog));
  };

  const handleLogout = () => {
    setUser(null);
    storage.removeUser();
    notify(`Bye, ${user.name}!`);
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog.id));
      blogFormRef.current.toggleVisibility();
      notify(`Blog ${blog.title}, by ${blog.author} removed`);
    }
  };

  if (!user) {
    return (
      <div className="container">
        <h2>blogs</h2>
        <Notification notification={notification} />
        <Login doLogin={handleLogin} />
      </div>
    );
  }

  // const byLikes = (a, b) => b.likes - a.likes;

  return (
    <div className="container">
      <h2>blogs</h2>
      <Notification notification={notification} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <NewBlog doCreate={handleCreate} />
      </Togglable>
      { blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default App;
