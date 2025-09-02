import { createSlice } from "@reduxjs/toolkit";

const makeUnit = createSlice({
  name: "area",
  initialState: {
    vibe: "#008080",
    mode: "auto",
    load: false,
    date: null,
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
    keepDate: (area, data) => {
      area.date = data.payload;
    },
  },
});

export const { keepVibe, keepMode, showLoad, hideLoad, keepDate } = makeUnit.actions;

export default makeUnit.reducer;
