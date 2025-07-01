import { useDispatch } from "react-redux";
import { newAntedote } from "../reducers/anecdoteReducer";

function AnecdoteForm() {
  const dispatch = useDispatch();
  const createAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    dispatch(newAntedote(content));
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
