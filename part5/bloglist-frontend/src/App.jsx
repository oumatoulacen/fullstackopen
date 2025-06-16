import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Tagglable from './components/Tagglable'
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [view, setView] = useState(null)

  const blogFormRef = useRef()

  const notify = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortBlogs(blogs)))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUserInfo')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    setBlogs((prevBlogs) => sortBlogs(prevBlogs))
  }, [blogs])

  const logout = () => {
    setUser(null)
    blogService.setToken(null)
    notify('Logged out successfully', 'success')
    window.localStorage.removeItem('loggedUserInfo')
  }

  return (
    <div>
      {user === null ? (
        <>
          <h2>Log in to application</h2>
          <Notification notification={notification} />
          <LoginForm setUser={setUser} notify={notify} />
        </>
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification notification={notification} />
          <p>
            {user.name} logged in{' '}
            <button onClick={logout} className="logout">
              logout
            </button>
          </p>

          <Tagglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              setBlogs={setBlogs}
              notify={notify}
              blogFormRef={blogFormRef}
            />
          </Tagglable>
          <br />
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              setBlogs={setBlogs}
              view={view}
              setView={setView}
              notify={notify}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
