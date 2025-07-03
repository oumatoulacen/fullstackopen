const sortAnecdotes = (a, b) => {
  return b.votes - a.votes;
};

// we use sort beacuse we pass a new array already instead of the original state to avoid mutability
// if you pass state to this function make sure to use toSorted instead of sort method
const sortedAnecdotes = (anecdotes) => anecdotes.sort(sortAnecdotes);

export const getId = () => (100000 * Math.random()).toFixed(0);
export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

export default sortedAnecdotes;
