import { createSlice } from "@reduxjs/toolkit"

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter: (state, action) => action.payload
  }
})
const { actions, reducer: filterReducer } = filterSlice;

export const { setFilter } = actions;
export default filterReducer;