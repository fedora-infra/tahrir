import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: ["Identity", "Accolade", "AccoList", "Search"],
  endpoints: (builder) => ({
    retrieveIdentity: builder.query({
      query: (identity) => `user/${identity}`,
      providesTags: (result, error, username) => [{ type: "Identity", id: username }],
    }),
    retrieveAccolade: builder.query({
      query: (accolade) => `../badge/${accolade}/json`,
      providesTags: (result, error, accolade) => [{ type: "Accolade", id: accolade }],
    }),
    retrieveAccoList: builder.query({
      query: () => "discover/accolade",
      providesTags: ["AccoList"],
    }),
    retrieveDiscover: builder.query({
      query: (searchQuery) => `search/${searchQuery}`,
      providesTags: (result, error, findtext) => [{ type: "Search", id: findtext }],
    }),
  }),
});

export const {
  useRetrieveIdentityQuery,
  useRetrieveAccoladeQuery,
  useRetrieveAccoListQuery,
  useRetrieveDiscoverQuery,
} = callUnit;

export default callUnit.reducer;
