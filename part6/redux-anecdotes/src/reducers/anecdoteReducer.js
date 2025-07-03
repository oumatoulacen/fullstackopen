import { createSlice } from "@reduxjs/toolkit";
import sortedAnecdotes, { asObject } from "../utils/anecdotes";
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote: (state, action) => {
      const id = action.payload;
      const anecdote = state.find(a => a.id === id);
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
      return sortedAnecdotes(state.map(a => a.id !== id ? a : updatedAnecdote));
    },
    newAnecdote: (state, action) => {
      const content = action.payload;
      const newAnecdote = asObject(content)
      anecdoteService.createNew(newAnecdote)
      return sortedAnecdotes(state.concat(newAnecdote));
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

export const { vote, newAnecdote, filterAnecdotes, appendAnecdotes, setAnecdotes } = anecdoteSlice.actions;
const reducer = anecdoteSlice.reducer;
export default reducer;
