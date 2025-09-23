import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

interface IWallet {
  balance: number;
  currency: string;
  transactions: ITransaction[];
}

interface ITransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
}

export const riderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWallet: builder.query<IWallet, void>({
            query: () => ({
                url: "/rider/wallet",
                method: "GET",
            }),
            providesTags: ["WALLET"],
            transformResponse: (response: IResponse<IWallet>) => response.data,
        }),
        addMoney: builder.mutation({
            query: (amount) => ({
                url: "/rider/wallet/add-money",
                method: "POST",
                data: { amount },
            }),
            invalidatesTags: ["WALLET"],
        }),
        withdrawMoney: builder.mutation({
            query: (amount) => ({
                url: "/rider/wallet/withdraw",
                method: "POST",
                data: { amount },
            }),
            invalidatesTags: ["WALLET"],
        }),
        getWalletTransactions: builder.query<ITransaction[], void>({
            query: () => ({
                url: "/rider/wallet/transactions",
                method: "GET",
            }),
            providesTags: ["WALLET"],
            transformResponse: (response: IResponse<ITransaction[]>) => response.data,
        }),
    })
})

export const { useGetWalletQuery, useAddMoneyMutation, useWithdrawMoneyMutation, useGetWalletTransactionsQuery } = riderApi; 