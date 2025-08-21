import { createSlice } from "@reduxjs/toolkit";

const makeunit = createSlice({
  name: "area",
  initialState: {
    vibe: "#008080",
    head: "",
    load: false,
    expt: null,
    acco: {
      assertions: [
        {
          date: 0.0,
          mail: "nulldata",
          name: "nulldata",
          rank: 0,
        },
      ],
      criteria: "nulldata",
      description: "nulldata",
      first_awarded: 0.0,
      first_awarded_person: "nulldata",
      last_awarded: 0.0,
      last_awarded_person: "nulldata",
      id: "nulldata",
      image: "nulldata",
      issuer: "nulldata",
      name: "nulldata",
      percent_earned: 0.0,
      tags: "nulldata",
      times_awarded: 0,
    },
  },
  reducers: {
    makeHead: (area, data) => {
      area.head = data.payload;
    },
    keepAcco: (area, data) => {
      area.acco = data.payload;
    },
    showLoad: (area) => {
      area.load = true;
    },
    hideLoad: (area) => {
      area.load = false;
    },
    keepExpt: (area, data) => {
      area.expt = data.payload;
    },
    wipeExpt: (area) => {
      area.expt = null;
    },
  },
});

export const { makeHead, keepAcco, showLoad, hideLoad, keepExpt, wipeExpt } = makeunit.actions;

export default makeunit.reducer;
