import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOtp, IVerifyOtp } from "@/types";




export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["USER"]
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/users/register",
                method: "POST",
                body: userInfo,
            }),
        }),
        sendOtp: builder.mutation<IResponse<null>, ISendOtp>({
            query: (userInfo) => ({
                url: "/auth/verify-user",
                method: "POST",
                body: userInfo,
            }),
        }),
        VerifyOtp: builder.mutation<IResponse<null>, IVerifyOtp>({
            query: (userInfo) => ({
                url: "/otp/verify",
                method: "POST",
                data: userInfo,
            }),
        }),
        UserInfo: builder.query({
            query: (userInfo) => ({
                url: "/users/me",
                method: "GET",
                body: userInfo,
            }),
            providesTags: ["USER"]
        }),
    })
})

export const { useRegisterMutation, useLoginMutation, useSendOtpMutation, useVerifyOtpMutation, useUserInfoQuery, useLogoutMutation } = authApi; 