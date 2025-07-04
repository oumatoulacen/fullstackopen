import { createContext, useContext, useReducer } from 'react'

const notificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  return (
    <notificationContext.Provider value={useReducer(notificationReducer, null)}>
      {children}
    </notificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default notificationContext