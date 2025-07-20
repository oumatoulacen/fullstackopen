import { createSlice } from "@reduxjs/toolkit";
export const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    addBlog: (state, action) => [...state, action.payload],
    updateBlog: (state, action) => {
      return state.map((blog) =>
        blog.id === action.payload.id ? action.payload : blog,
      );
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload);
    },
  },
});

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogsSlice.actions;

export default blogsSlice.reducer;
