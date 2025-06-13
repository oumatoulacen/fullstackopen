import loginService from '../services/login'
import blogService from '../services/blogs'
import { useState } from 'react'

function LoginForm({ setUser, notify }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        loginService.login({ username, password })
            .then(user => {
                setUser(user)
                blogService.setToken(user.token)
                notify(`Welcome ${user.name}`, 'success')
                window.localStorage.setItem('loggedUserInfo', JSON.stringify(user))
            })
            .catch(error => {
                console.error('Login failed:', error)
                notify('Login failed. Please check your credentials.', 'error')
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm