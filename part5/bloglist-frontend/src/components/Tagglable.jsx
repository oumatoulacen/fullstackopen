import { useState, forwardRef, useImperativeHandle } from "react"


const Tagglable = forwardRef((props, ref) => {
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
                <div className="tagglableContent">
                    {props.children}
                </div>
            )}
            <button onClick={toggleVisibility}>
                {visible ? "cancel" : props.buttonLabel}
            </button>
        </div>
    )
})

export default Tagglable