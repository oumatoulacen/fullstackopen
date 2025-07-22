import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState(null) // Initialize users as null to handle loading state (null is not ideal for rendering)
  const [error, setError] = useState(null)
  useEffect(() => {
    userService
      .getAll()
      .then((users) => setUsers(users))
      .catch((error) => setError(error.message))
  }, [])

  if (error) {
    return <div>{error}</div>
  }

  if (!users) {
    return <div>Loading...</div>
  }

  if (users.length === 0) {
    return <div>No users found</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
