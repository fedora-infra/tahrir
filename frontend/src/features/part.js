import { createSlice } from "@reduxjs/toolkit";

const makeUnit = createSlice({
  name: "area",
  initialState: {
    vibe: "#008080",
    mode: "auto",
    load: false,
  },
  reducers: {
    keepVibe: (area, data) => {
      area.vibe = data.payload;
    },
    keepMode: (area, data) => {
      area.mode = data.payload;
    },
    showLoad: (area) => {
      area.load = true;
    },
    hideLoad: (area) => {
      area.load = false;
    },
  },
});

export const { keepVibe, keepMode, showLoad, hideLoad } = makeUnit.actions;

export default makeUnit.reducer;
