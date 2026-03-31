import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL = import.meta.env.VITE_API_URL

export const callUnit = createApi({
  reducerPath: "callunit",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL + "/json/",
  }),
  tagTypes: [
    "Identity",
    "Accolade",
    "AccoList",
    "Discover",
    "Category",
    "Rarities",
    "Averment",
    "Granting",
    "AccoladeSearch",
    "IdentitySearch",
    "QRInvite",
    "Sanction",
    "Campaign",
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
    retrieveGranting: builder.query({
      query: ({ begin = 0, limit } = {}) => {
        const params = { begin };
        if (limit !== undefined) {
          params.limit = limit;
        }
        return {
          url: "../api/assertions",
          method: "GET",
          params,
        };
      },
      providesTags: ["Granting"],
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
    deletionAverment: builder.mutation({
      query: ({ badge_id, username }) => ({
        url: "../api/admin/assertions",
        method: "DELETE",
        body: { badge_id, username },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Averment", "Discover"], // Reload Averment and Discover on deletion
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
      invalidatesTags: ["QRInvite", "Campaign"], // Reload QRInvite and Campaign on creation
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
      invalidatesTags: ["QRInvite", "Campaign"], // Reload QRInvite and Campaign on deletion
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
    creationSanction: builder.mutation({
      query: (sanctionData) => ({
        url: "../api/admin/authorization",
        method: "POST",
        body: sanctionData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Sanction"], // Reload Sanction on creation
    }),
    deletionSanction: builder.mutation({
      query: ({ badge_id, user }) => ({
        url: "../api/admin/authorization",
        method: "DELETE",
        body: { badge_id, user },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Sanction"], // Reload Sanction on deletion
    }),
    creationIdentity: builder.mutation({
      query: (userData) => ({
        url: "../api/admin/users",
        method: "POST",
        body: userData,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["IdentitySearch"],
    }),
    updationIdentity: builder.mutation({
      query: ({ user_id, filldata }) => ({
        url: `../api/admin/users/${user_id}`,
        method: "PUT",
        body: filldata,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { user_id }) => [{ type: "Identity", id: user_id }, "IdentitySearch"],
    }),
    retrieveCampaign: builder.query({
      query: (username) => ({
        url: `../api/invitations/${username}`,
        method: "GET",
      }),
      providesTags: (result, error, username) => [{ type: "Campaign", id: username }],
    }),
    toggleIdentityOptOut: builder.mutation({
      query: ({ user_id, opt_out }) => ({
        url: `../api/admin/users/${user_id}/opt_out`,
        method: "PUT",
        body: { opt_out },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { user_id }) => [{ type: "Identity", id: user_id }, "IdentitySearch"],
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
  useRetrieveGrantingQuery,
  useRetrieveQRInviteQuery,
  useCreationAccoladeMutation,
  useCreationAvermentMutation,
  useDeletionAvermentMutation,
  useLookupAccoladeQuery,
  useLookupIdentityQuery,
  useCreationQRInviteMutation,
  useDeletionQRInviteMutation,
  useUpdationAccoladeMutation,
  useCreationSanctionMutation,
  useDeletionSanctionMutation,
  useCreationIdentityMutation,
  useUpdationIdentityMutation,
  useRetrieveCampaignQuery,
  useToggleIdentityOptOutMutation,
} = callUnit;
export default callUnit.reducer;
