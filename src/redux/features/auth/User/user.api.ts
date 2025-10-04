import { baseApi } from "@/redux/baseApi";
import type { IUser } from "@/types/auth.type";

export interface IUserUpdatePayload {
  id: string;
  data: Record<string, unknown>;
}

interface IUserResponse {
  data: IUser[];
  meta: {
    total: number;
  };
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<IUserResponse, Record<string, unknown> | void>({
      query: (params) => ({
        url: `/users`,
        params,
      }),
      providesTags: ["USER"],
    }),

    getUserById: builder.query<IUser, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
      }),
      providesTags: ["USER"],
    }),

    updateUser: builder.mutation<IUser, IUserUpdatePayload>({
      query: ({ id, data }: IUserUpdatePayload) => ({
        url: `/users/update/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USER"],
    }),

    blockUser: builder.mutation<IUser, string>({
      query: (id: string) => ({
        url: `/users/block/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    suspendUser: builder.mutation<IUser, string>({
      query: (id: string) => ({
        url: `/users/suspend/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    activateUser: builder.mutation<IUser, string>({
      query: (id: string) => ({
        url: `/users/activate/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["USER"],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useBlockUserMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
} = userApi;