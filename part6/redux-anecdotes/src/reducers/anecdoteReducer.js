import sortedAnecdotes from "../utils/sorting";

export const vote = (id) => ({
  type: "VOTE",
  payload: { id }
});

export const newAntedote = (content) => ({
  type: "NEW",
  payload: {
    content
  },
});

export const filterAnecdotes = (filter) => ({
  type: 'FILTER',
  payload: { filter }
});

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = sortedAnecdotes(anecdotesAtStart.map(asObject));

const reducer = (state = initialState, action) => {
  console.log("action", action);
  switch (action.type) {
    case "VOTE":
      return sortedAnecdotes(
        state.map((anecdote) => {
          return anecdote.id !== action.payload.id
            ? anecdote
            : { ...anecdote, votes: anecdote.votes + 1 };
        })
      );
    case "NEW":
      return sortedAnecdotes(state.concat(asObject(action.payload.content)));
    case 'FILTER':
      // use initialState to simulate database fetching instead of filtering the state directly
      // or use a second variable to keep all anecdotes and filter them instead of the state
      return sortedAnecdotes(state.filter(anecdote =>
        anecdote.content.toLowerCase().includes(action.payload.filter.toLowerCase())
      ));
    default:
      return state;
  }
};

export default reducer;
