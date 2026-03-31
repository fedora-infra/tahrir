import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import md5 from "crypto-js/md5";

import { userManager } from "../config/oidc.js";
import { API_BASE_URL } from "./call.js";

export const loadUserData = createAsyncThunk("auth/loadUserData", async () => {
  const user = await userManager.getUser();
  const response = await fetch(API_BASE_URL + "/api/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.access_token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const person = await response.json();
  if (!user || user.expired) {
    return null;
  }

  // Update what we got from the OIDC provider with what we got from the API
  user.profile.nickname = person.nickname;
  user.profile.person = person;

  return user.profile;
});

const authData = createSlice({
  name: "auth",
  initialState: {
    user: null,
    disp: "https://seccdn.libravatar.org/avatar/40f8d096a3777232204cb3f796c577b7?s=30",
    status: "idle",
  },
  reducers: {
    wipeUserData: (auth) => {
      auth.user = null;
      auth.disp = "https://seccdn.libravatar.org/avatar/40f8d096a3777232204cb3f796c577b7?s=30";
      auth.status = "idle";
    },
  },
  extraReducers: (plan) => {
    plan
      .addCase(loadUserData.pending, (auth) => {
        auth.status = "load";
      })
      .addCase(loadUserData.fulfilled, (auth, action) => {
        auth.user = action.payload;
        auth.disp = action.payload
          ? `https://seccdn.libravatar.org/avatar/${md5(action.payload.email.trim().toLowerCase()).toString()}?s=30&d=retro`
          : "https://seccdn.libravatar.org/avatar/40f8d096a3777232204cb3f796c577b7?s=30";
        auth.status = "pass";
      })
      .addCase(loadUserData.rejected, (auth) => {
        auth.user = null;
        auth.disp = "https://seccdn.libravatar.org/avatar/40f8d096a3777232204cb3f796c577b7?s=30";
        auth.status = "fail";
      });
  },
});

export const { wipeUserData } = authData.actions;

export default authData.reducer;
