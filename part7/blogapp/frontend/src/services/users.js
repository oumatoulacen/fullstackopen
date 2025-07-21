import axios from 'axios'

// Define the user service to interact with the backend API
const userService = {
  getAll: async () => {
    const response = await axios.get('/api/users')
    return response.data
  },
  getUserById: async (id) => {
    const response = await axios.get(`/api/users/${id}`)
    return response.data
  },
}

export default userService
