import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: ["Identity", "Accolade", "AccoList", "Search", "Category"],
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
    retrieveCategory: builder.query({
      query: (category) => ({
        url: `https://badges.gridhead.net/json/category/${category}`,
        method: "GET",
      }),
      providesTags: (result, error, category) => [{ type: "Category", id: category }],
    }),
  }),
});

export const {
  useRetrieveIdentityQuery,
  useRetrieveAccoladeQuery,
  useRetrieveAccoListQuery,
  useRetrieveDiscoverQuery,
  useRetrieveCategoryQuery,
} = callUnit;

export default callUnit.reducer;
