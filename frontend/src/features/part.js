import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_VIBE = import.meta.env.VITE_VIBE;

const initVibe = () => {
  try {
    const savedVibe = localStorage.getItem("tahrir-vibe");
    return savedVibe || DEFAULT_VIBE;
  } catch {
    return DEFAULT_VIBE;
  }
};

const makeUnit = createSlice({
  name: "area",
  initialState: {
    vibe: initVibe(),
    mode: "auto",
    load: false,
    date: null,
    baseNote: {
      show: false,
      pass: true,
      data: "",
    },
  },
  reducers: {
    keepVibe: (area, data) => {
      area.vibe = data.payload;
      try {
        localStorage.setItem("tahrir-vibe", data.payload);
      } catch (error) {
        console.warn("Failed to save vibe to localStorage:", error);
      }
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
    showBaseNote: (area, data) => {
      area.baseNote.show = true;
      area.baseNote.pass = data.payload.pass;
      area.baseNote.data = data.payload.data;
    },
    hideBaseNote: (area) => {
      area.baseNote.show = false;
    },
  },
});

export const { keepVibe, keepMode, showLoad, hideLoad, keepDate, showBaseNote, hideBaseNote } = makeUnit.actions;

export default makeUnit.reducer;
