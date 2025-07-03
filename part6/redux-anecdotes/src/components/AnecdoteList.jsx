import { useSelector, useDispatch } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

function AnecdoteList() {
  const anecdotes = useSelector((state) => state.anecdotes);
  const dispatch = useDispatch();

  const addVote = (id) => {
    dispatch(voteAnecdote(id));
    const votedAnecdote = anecdotes.find((anecdote) => anecdote.id === id);
    dispatch(setNotification(`you voted '${votedAnecdote.content}'`, 5));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => addVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnecdoteList;
