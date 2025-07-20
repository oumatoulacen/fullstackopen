import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./reducers/notification";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

export default store;
