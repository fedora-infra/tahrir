import { configureStore } from "@reduxjs/toolkit";

import { callUnit } from "./call.js";
import callUnitReducer from "./call.js";
import makeUnitReducer from "./part.js";

export const data = configureStore({
  reducer: {
    area: makeUnitReducer,
    [callUnit.reducerPath]: callUnitReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(callUnit.middleware),
});
