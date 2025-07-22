import PropTypes from 'prop-types'
import { useParams, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import userService from '../services/users'

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    userService
      .getUserById(id)
      .then((user) => setUser(user))
      .catch((error) => setError(error.message))
  }, [id])

  if (error) {
    return <div>{error}</div>
  }
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blogs/${blog.id}`}
            style={{ textDecoration: 'none', color: '#333' }}
          >
            <li>{blog.title}</li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default UserDetails
