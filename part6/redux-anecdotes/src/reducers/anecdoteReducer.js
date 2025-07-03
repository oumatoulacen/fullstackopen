import { createSlice } from "@reduxjs/toolkit";
import sortedAnecdotes, { asObject } from "../utils/anecdotes";
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote: (state, action) => {
      const updatedAnecdote = action.payload;
      return sortedAnecdotes(state.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote));
    },
    filterAnecdotes: (state, action) => {
      const filter = action.payload.toLowerCase();
      return sortedAnecdotes(state.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter)
      ));
    },
    appendAnecdotes: (state, action) => {
      return sortedAnecdotes(state.concat(action.payload));
    },
    setAnecdotes: (state, action) => {
      return sortedAnecdotes(action.payload);
    }
  }
});

// Thunk to fetch anecdotes from the server
export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

// Thunk to vote for anecdotes
export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(a => a.id === id);
    if (anecdote) {
      const updatedAnecdote = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 });
      dispatch(vote(updatedAnecdote));
    }
  };
}

// Thunk to create new anecdote
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(asObject(content));
    dispatch(appendAnecdotes(newAnecdote));
  };
}

export const { vote, newAnecdote, filterAnecdotes, appendAnecdotes, setAnecdotes } = anecdoteSlice.actions;
const reducer = anecdoteSlice.reducer;
export default reducer;
