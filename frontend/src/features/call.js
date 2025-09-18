import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: ["Identity", "Accolade", "AccoList", "Discover", "Category", "Rarities"],
  endpoints: (builder) => ({
    retrieveIdentity: builder.query({
      query: (identity) => ({
        url: `user/${identity}`,
        method: "GET",
      }),
      providesTags: (result, error, username) => [{ type: "Identity", id: username }],
    }),
    retrieveAccolade: builder.query({
      query: (accolade) => ({
        url: `../api/badges/${accolade}`,
        method: "GET",
      }),
      providesTags: (result, error, accolade) => [{ type: "Accolade", id: accolade }],
    }),
    retrieveAccoList: builder.query({
      query: () => ({
        url: "../api/badges",
        method: "GET",
      }),
      providesTags: ["AccoList"],
    }),
    retrieveDiscover: builder.query({
      query: (discover) => ({
        url: `search/${discover}`,
        method: "GET",
      }),
      providesTags: (result, error, discover) => [{ type: "Discover", id: discover }],
    }),
    retrieveRarities: builder.query({
      query: (rarities) => `rarities/${rarities}`,
      providesTags: (result, error, rarities) => [{ type: "Rarities", id: rarities }],
    }),
    retrieveCategory: builder.query({
      query: (category) => ({
        url: `../api/badges/category/${category}`,
        method: "GET",
      }),
      providesTags: (result, error, category) => [{ type: "Category", id: category }],
    }),
    retrieveRankings: builder.query({
      query: ({ y, w, m, d, begin = 0, limit = 200 } = {}) => {
        let link = "report";
        if (y) {
          link += `/y/${y}`;
          if (m) {
            link += `/m/${m}`;
            if (d) {
              link += `/d/${d}`;
              if (w) {
                link += `/week`;
              }
            }
          }
        }
        return {
          url: link,
          method: "GET",
          params: { begin, limit },
        };
      },
      providesTags: ["Rankings"],
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
  useRetrieveRankingsQuery,
} = callUnit;

export default callUnit.reducer;
