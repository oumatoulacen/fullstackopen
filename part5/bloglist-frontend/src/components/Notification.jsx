import React from 'react'

function Notification({ notification }) {
  if (!notification) return null

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )
}

export default Notification