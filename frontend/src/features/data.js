import { configureStore } from "@reduxjs/toolkit";

import makeunitReducer from "./part.js";

export const data = configureStore({
  reducer: {
    area: makeunitReducer,
  },
});
