import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import axiosBaseQuery from "./axiosBaseQuery";
import config from "@/config";

export const baseApi = createApi({
    reducerPath: "baseApi",
    // baseQuery: axiosBaseQuery(),
    // ! if do not use Axios
    baseQuery: fetchBaseQuery({
        baseUrl: config.baseUrl,
        credentials: "include"
    }),
    tagTypes: ["USER", "TOUR", "DIVISION", "BOOKING"],
    endpoints: () => ({}),
})