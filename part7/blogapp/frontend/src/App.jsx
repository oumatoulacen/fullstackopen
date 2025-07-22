import { useState, useEffect, createRef, useParams } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { setNotification, clearNotification } from "./reducers/notificationReducer";
import { setBlogs, addBlog, updateBlog, removeBlog } from "./reducers/blogsReducer";
import { setUser, clearUser } from "./reducers/userReducer";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";

import storage from "./services/storage";
import Login from "./components/Login";
import Blog from "./components/Blog";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import Menu from "./components/Menu";
import About from "./components/About";
import Users from "./components/Users";
import UserDetails from "./components/UserDetails";
import BlogDetails from "./components/BlogDetails";

const App = () => {
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);
  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => dispatch(setBlogs(blogs)));
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      dispatch(setUser(user));
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
      dispatch(setUser(user));
      // Save user to local storage for persistence
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
    } catch (error) {
      notify("Wrong credentials", "error");
    }
  };

  const handleCreate = async (blog) => {
    const newBlog = await blogService.create(blog);
    dispatch(addBlog(newBlog));
    notify(`Blog created: ${newBlog.title}, ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const handleVote = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });

    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    dispatch(updateBlog(updatedBlog));
  };

  const handleLogout = () => {
    dispatch(clearUser());
    storage.removeUser();
    notify(`Bye, ${user.name}!`);
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog.id));
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
      <Menu user={user} doLogout={handleLogout} />
      <Notification notification={notification} />
      {/* <h2>blogs</h2> */}
      <Routes>
        <Route path="/" element={
          <div>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <NewBlog doCreate={handleCreate} />
            </Togglable>
            {blogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
              />
            ))}
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/blogs/:id" element={
          <BlogDetails
            blogs={blogs}
            handleVote={handleVote}
            handleDelete={handleDelete}
            setBlogs={setBlogs}
            notify={notify}
          />
        } />
      </Routes>
    </div>
  );
};

export default App;
