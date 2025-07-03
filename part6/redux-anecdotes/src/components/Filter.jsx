import { useDispatch } from "react-redux"
import { setFilter } from "../reducers/filterReducer"
import { filterAnecdotes } from "../reducers/anecdoteReducer"

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
    dispatch(filterAnecdotes(event.target.value))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter