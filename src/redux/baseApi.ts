import { createApi } from "@reduxjs/toolkit/query/react";
// import axiosBaseQuery from "./axiosBaseQuery";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: axiosBaseQuery(),
    // ! if do not use Axios
    // baseQuery: fetchBaseQuery({
    //     baseUrl: config.baseUrl,
    //     credentials: "include"
    // }),
    tagTypes: ["USER", "RIDER", "DRIVER", "admin", "user", "tours", "bookings", "payment", "WALLET"],
    endpoints: () => ({}),
})

