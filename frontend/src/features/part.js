import { createSlice } from "@reduxjs/toolkit";

const makeunit = createSlice({
  name: "area",
  initialState: {
    vibe: "#008080",
    expt: null,
    mode: "auto",
    load: false,
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
      tags: [],
      times_awarded: 0,
    },
    user: {
      classified: {
        community: [],
        content: [],
        development: [],
        event: [],
        miscellaneous: [],
        quality: [],
      },
      serialized: [],
      mail: "nulldata",
      percent_earned: 0.0,
      percentile: 0.0,
      rank: 0,
      user: "nulldata",
      user_count: 0,
      awards: 0,
    },
    list: {
      classified: {
        full: {
          community: [],
          content: [],
          development: [],
          event: [],
          miscellaneous: [],
          quality: [],
        },
        newest: {
          community: [],
          content: [],
          development: [],
          event: [],
          miscellaneous: [],
          quality: [],
        },
      },
      disordered: {
        full: [],
        newest: [],
      },
    },
  },
  reducers: {
    keepAcco: (area, data) => {
      area.acco = data.payload;
    },
    keepExpt: (area, data) => {
      area.expt = data.payload;
    },
    wipeExpt: (area) => {
      area.expt = null;
    },
    keepVibe: (area, data) => {
      area.vibe = data.payload;
    },
    keepUser: (area, data) => {
      area.user = data.payload;
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
    keepList: (area, data) => {
      area.list = data.payload;
    },
  },
});

export const { keepAcco, keepExpt, wipeExpt, keepVibe, keepUser, keepMode, showLoad, hideLoad, keepList } =
  makeunit.actions;

export default makeunit.reducer;
