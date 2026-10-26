import { configureStore } from "@reduxjs/toolkit";

import authDataReducer from "./auth.js";
import callUnitReducer from "./call.js";
import { callUnit } from "./call.js";
import makeUnitReducer from "./part.js";

export const data = configureStore({
  reducer: {
    area: makeUnitReducer,
    auth: authDataReducer,
    [callUnit.reducerPath]: callUnitReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(callUnit.middleware),
});
