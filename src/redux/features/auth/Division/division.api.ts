import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addDivision: builder.mutation({
            query: (divisionData) => ({
                url: "/division/create",
                method: "POST",
                data: divisionData,
            }),
            invalidatesTags: ["DIVISION"],
        }),
        removeDivision: builder.mutation({
            query: (divisionId) => ({
                url: `/division/${divisionId}`,
                method: "DELETE",
                data: divisionId,
            }),
            invalidatesTags: ["DIVISION"],
        }),
        getDivisions: builder.query({
            query: (params) => ({
                url: "/division",
                method: "GET",
                params,
            }),
            providesTags: ["DIVISION"],
            // specific data fetching / unused data remove for faster
            transformResponse: (response) => response.data,
        }),
    })
})
export const { useAddDivisionMutation, useGetDivisionsQuery, useRemoveDivisionMutation } = divisionApi;