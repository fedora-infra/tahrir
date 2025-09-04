import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: ["Identity", "Accolade", "AccoList", "Search", "Category", "Rarities"],
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
      query: (findtext) => `search/${findtext}`,
      providesTags: (result, error, findtext) => [{ type: "Search", id: findtext }],
    }),
    retrieveCategory: builder.query({
      query: (category) => `category/${category}`,
      providesTags: (result, error, category) => [{ type: "Category", id: category }],
    }),
    retrieveRarities: builder.query({
      query: (rarities) => `rarities/${rarities}`,
      providesTags: (result, error, rarities) => [{ type: "Rarities", id: rarities }],
    }),
  }),
});

export const {
  useRetrieveIdentityQuery,
  useRetrieveAccoladeQuery,
  useRetrieveAccoListQuery,
  useRetrieveDiscoverQuery,
  useRetrieveCategoryQuery,
  useRetrieveRaritiesQuery,
} = callUnit;

export default callUnit.reducer;
