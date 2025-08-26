import { createSlice } from "@reduxjs/toolkit";

const makeunit = createSlice({
  name: "area",
  initialState: {
    vibe: "#008080",
    head: "",
    load: false,
    expt: null,
    hand: false,
    shut: false,
    anch: null,
    vibeAnch: false,
    modeAnch: false,
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
    user: {
      classified: {
        community: [],
        content: [],
        development: [],
        event: [],
        miscellaneous: [],
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
    keepVibe: (area, data) => {
      area.vibe = data.payload;
    },
    keepVibeAnch: (area, data) => {
      area.vibeAnch = data.payload;
    },
    keepModeAnch: (area, data) => {
      area.modeAnch = data.payload;
    },
    makeHand: (area, data) => {
      area.hand = data.payload;
    },
    makeShut: (area, data) => {
      area.shut = data.payload;
    },
    keepUser: (area, data) => {
      area.user = data.payload;
    },
  },
});

export const {
  makeHead,
  keepAcco,
  showLoad,
  hideLoad,
  keepExpt,
  wipeExpt,
  keepVibe,
  keepVibeAnch,
  keepModeAnch,
  makeHand,
  makeShut,
  keepUser,
} = makeunit.actions;

export default makeunit.reducer;
