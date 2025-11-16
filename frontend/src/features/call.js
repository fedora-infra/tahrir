import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: "/json/",
  }),
  tagTypes: [
    "Identity",
    "Accolade",
    "AccoList",
    "Discover",
    "Category",
    "Rarities",
    "Averment",
    "AccoladeSearch",
    "IdentitySearch",
    "QRInvite",
  ],
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
    retrieveAverment: builder.query({
      query: ({ accolade, begin = 0, limit = 100 } = {}) => ({
        url: `../api/assertions/${accolade}`,
        method: "GET",
        params: { begin, limit },
      }),
      providesTags: (result, error, { accolade }) => [{ type: "Averment", id: accolade }],
    }),
    creationAccolade: builder.mutation({
      query: (badgeData) => ({
        url: "../api/admin/badges",
        method: "POST",
        body: badgeData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["AccoList"], // Reload AccoList on creation
    }),
    creationAverment: builder.mutation({
      query: (assertionData) => ({
        url: "../api/admin/assertions",
        method: "POST",
        body: assertionData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Averment"], // Reload Averment on creation
    }),
    lookupAccolade: builder.query({
      query: (searchString) => ({
        url: `../api/badges/search/${encodeURIComponent(searchString)}`,
        method: "GET",
      }),
      providesTags: (result, error, searchString) => [{ type: "AccoladeSearch", id: searchString }],
    }),
    lookupIdentity: builder.query({
      query: (searchString) => ({
        url: `../api/users/search/${encodeURIComponent(searchString)}`,
        method: "GET",
      }),
      providesTags: (result, error, searchString) => [{ type: "IdentitySearch", id: searchString }],
    }),
    creationQRInvite: builder.mutation({
      query: (invitationData) => ({
        url: "../api/admin/invitations",
        method: "POST",
        body: invitationData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["QRInvite"], // Reload QRInvite on creation
    }),
    deletionQRInvite: builder.mutation({
      query: (invitationId) => ({
        url: "../api/admin/invitations",
        method: "DELETE",
        body: { invitation_id: invitationId },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["QRInvite"], // Reload QRInvite on deletion
    }),
    retrieveQRInvite: builder.query({
      query: (username) => ({
        url: `../api/admin/invitations/${username}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, username) => [{ type: "QRInvite", id: username }],
    }),
    updationAccolade: builder.mutation({
      query: ({ accolade, filldata }) => ({
        url: `../api/admin/badges/${accolade}`,
        method: "PUT",
        body: filldata,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { accolade }) => [
        { type: "Accolade", id: accolade },
        { type: "Averment", id: accolade },
        "AccoList",
        "Discover",
      ],
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
  useRetrieveAvermentQuery,
  useRetrieveQRInviteQuery,
  useCreationAccoladeMutation,
  useCreationAvermentMutation,
  useLookupAccoladeQuery,
  useLookupIdentityQuery,
  useCreationQRInviteMutation,
  useDeletionQRInviteMutation,
  useUpdationAccoladeMutation,
} = callUnit;

export default callUnit.reducer;
