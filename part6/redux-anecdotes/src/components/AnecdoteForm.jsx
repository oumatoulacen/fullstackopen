import { useDispatch } from "react-redux";
import { newAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, clearNotification } from "../reducers/notificationReducer";

function AnecdoteForm() {
  const dispatch = useDispatch();
  const createAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    dispatch(newAnecdote(content));
    dispatch(setNotification(`new anecdote '${content}' created`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={(e) => createAnecdote(e)}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

export default AnecdoteForm;
