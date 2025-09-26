import { baseApi } from "@/redux/baseApi";

export interface IWallet {
  balance: number;
  currency: string;
}

export interface ITransaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  createdAt: string;
  status: string;
  method?: string;
  reference?: string;
}

export interface IWalletResponse {
  success: boolean;
  data: IWallet;
  message?: string;
}

export interface ITransactionResponse {
  success: boolean;
  data: ITransaction[];
  message?: string;
}

export interface IWalletActionResponse {
  success: boolean;
  message: string;
  data?: {
    transaction: ITransaction;
    wallet: IWallet;
  };
}

export interface IAddMoneyPayload {
  amount: number;
  method: string;
  description?: string;
}

export interface IWithdrawMoneyPayload {
  amount: number;
  bankAccount: string;
  description?: string;
}

export const riderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get wallet information including balance
        getWallet: builder.query<IWallet, void>({
            query: () => ({
                url: '/wallet',
                method: 'GET',
            }),
            transformResponse: (response: IWalletResponse) => response.data,
            providesTags: ["WALLET"],
        }),

        // Add money to wallet
        addMoney: builder.mutation<IWalletActionResponse, IAddMoneyPayload>({
            query: (payload) => ({
                url: '/wallet/deposit',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ["WALLET"],
        }),

        // Withdraw money from wallet
        withdrawMoney: builder.mutation<IWalletActionResponse, IWithdrawMoneyPayload>({
            query: (payload) => ({
                url: '/wallet/withdraw',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ["WALLET"],
        }),

        // Get wallet transaction history
        getWalletTransactions: builder.query<ITransaction[], void>({
            query: () => ({
                url: '/wallet/transactions',
                method: 'GET',
            }),
            transformResponse: (response: ITransactionResponse) => response.data,
            providesTags: ["WALLET"],
        }),
    })
})

export const { 
  useGetWalletQuery, 
  useAddMoneyMutation, 
  useWithdrawMoneyMutation, 
  useGetWalletTransactionsQuery
} = riderApi;