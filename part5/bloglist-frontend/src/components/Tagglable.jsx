import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'


const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    // Expose the toggleVisibility function to the parent component
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      {visible && (
        <div className='tagglableContent'>
          {props.children}
        </div>
      )}
      <button className='cancel' onClick={toggleVisibility}>
        {visible ? 'Cancel' : props.buttonLabel}
      </button>
    </div>
  )
})

Togglable.displayName = 'Togglable'
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}


export default Togglable