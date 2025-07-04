import { useContext } from "react"
import notificationContext from "../anecdoteContext"


const Notification = () => {
  const [ notification, notificationDispatch ] = useContext(notificationContext)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  if (!notification) return null

  return (
    <div style={style}>
      {notification}
      <button onClick={() => notificationDispatch({ type: 'CLEAR_NOTIFICATION' })}>
        close
      </button>
    </div>
  )
}

export default Notification
