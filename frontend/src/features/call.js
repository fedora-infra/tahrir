import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: ["Identity", "Accolade", "AccoList"],
  endpoints: (builder) => ({
    retrieveIdentity: builder.query({
      query: (identity) => `user/${identity}`,
      providesTags: (result, error, username) => [{ type: "Identity", id: username }],
    }),
    retrieveAccolade: builder.query({
      query: (accolade) => `../badge/${accolade}/json`,
      providesTags: (result, error, badgeId) => [{ type: "Accolade", id: badgeId }],
    }),
    retrieveAccoList: builder.query({
      query: () => "discover/accolade",
      providesTags: ["AccoList"],
    }),
  }),
});

export const { useRetrieveIdentityQuery, useRetrieveAccoladeQuery, useRetrieveAccoListQuery } = callUnit;

export default callUnit.reducer;
