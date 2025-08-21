import { configureStore } from "@reduxjs/toolkit";

import makeunitReducer from "./part.jsx";

export const data = configureStore({
  reducer: {
    area: makeunitReducer,
  },
});
