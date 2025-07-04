import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import anecdoteContext from "./anecdoteContext";
import { getAnecdotes, updateAnecdote } from "./requests";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const [notification, notificationDispatch] = useContext(anecdoteContext);
  const queryClient = useQueryClient();
  const anecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({queryKey: ['anecdotes']})
    // }
    onSuccess: (anecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) => (a.id !== anecdote.id ? a : anecdote))
      );
    },
  });
  const {
    isPending,
    isError,
    data: anecdotes,
    error,
  } = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 3,
  });

  const handleVote = (anecdote) => {
    anecdoteMutation.mutate(anecdote);
    notificationDispatch({
      type: "SET_NOTIFICATION",
      payload: `you voted '${anecdote.content}'`,
    });
    setTimeout(() => {
      notificationDispatch({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
  };

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error fetching anecdotes: {error.message} </div>;
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
