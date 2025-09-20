import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
        query: (bookingData) => ({
            url: "/booking",
            method: "POST",
            data: bookingData,
        }),
        invalidatesTags: ["BOOKING"],
        }),
        getUserBookings: builder.query({
        query: () => ({
            url: "/booking/my-bookings",
            method: "GET",
        }),
        providesTags: ["BOOKING"],
        transformResponse: (response) => {
            // Handle different response structures
            if (response.data) return response.data;
            if (response.bookings) return response.bookings;
            return response;
        },
        }),
        getTourTypes: builder.query({
        query: () => ({
            url: "/tour/tour-types",
            method: "GET",
        }),
        providesTags: ["TOUR"],
        transformResponse: (response) => response.data,
        }),
    }),
});

export const { useCreateBookingMutation, useGetUserBookingsQuery, useGetTourTypesQuery } = bookingApi;