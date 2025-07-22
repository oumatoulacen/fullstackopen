import React from 'react'
import { Link } from 'react-router-dom'

const Menustyle = {
  padding: '10px',
  backgroundColor: '#f0f0f0',
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '10px',
  textAlign: 'center',
}

const linkStyle = {
  margin: '0 10px',
  textDecoration: 'none',
  color: '#123',
  fontWeight: 'bold',
}

function Menu({ user, doLogout }) {
  return (
    <div style={Menustyle}>
      <Link to="/" style={linkStyle}>
        Home
      </Link>
      <Link to="/about" style={linkStyle}>
        About
      </Link>
      <Link to="/users" style={linkStyle}>
        Users
      </Link>
      {user && (
        <div style={{ display: 'inline-block', marginLeft: '60px' }}>
          {user.name} logged in
          <button onClick={doLogout}>logout</button>
        </div>
      )}
    </div>
  )
}

export default Menu
