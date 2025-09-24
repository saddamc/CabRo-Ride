import { baseApi } from "@/redux/baseApi";

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

// Mock data for wallet implementation
// This data is stored in localStorage for persistence

// Helper function to get or initialize wallet data
const getMockWallet = (): IWallet => {
  // Try to get wallet from localStorage
  const storedWallet = localStorage.getItem('mockWallet');
  
  if (storedWallet) {
    return JSON.parse(storedWallet);
  }
  
  // Default wallet data if none exists
  const defaultWallet: IWallet = {
    balance: 250,
    currency: 'USD',
    transactions: [
      {
        id: "tr-" + Math.random().toString(36).substring(2, 10),
        amount: 150,
        type: 'credit',
        description: 'Payment for ride #RD7890',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: "tr-" + Math.random().toString(36).substring(2, 10),
        amount: 80,
        type: 'credit',
        description: 'Payment for ride #RD7891',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      },
      {
        id: "tr-" + Math.random().toString(36).substring(2, 10),
        amount: 50,
        type: 'debit',
        description: 'Withdrawal to bank account',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
      },
      {
        id: "tr-" + Math.random().toString(36).substring(2, 10),
        amount: 70,
        type: 'credit',
        description: 'Payment for ride #RD7895',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    ]
  };
  
  // Save default wallet to localStorage
  localStorage.setItem('mockWallet', JSON.stringify(defaultWallet));
  
  return defaultWallet;
};

// Helper function to save wallet data
const saveMockWallet = (wallet: IWallet): void => {
  localStorage.setItem('mockWallet', JSON.stringify(wallet));
};

export const riderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Use queryFn to create mock implementation instead of API calls
        getWallet: builder.query<IWallet, void>({
            queryFn: () => {
                // Simulate API delay
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                          // In a real implementation, we would call the API
                          // For now, use mock data stored in localStorage
                          const wallet = getMockWallet();
                          resolve({ data: wallet });
                        } catch (error: unknown) {
                          // Handle any errors
                          console.error("Failed to load wallet data:", error);
                          resolve({
                            error: {
                              status: 500,
                              data: { message: "Failed to load wallet data" }
                            }
                          });
                        }
                    }, 500);
                });
            },
            providesTags: ["WALLET"],
        }),

        addMoney: builder.mutation<{ success: boolean, message: string }, number>({
            queryFn: (amount) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                          // Get current wallet
                          const wallet = getMockWallet();
                          
                          // Validate amount
                          if (amount <= 0) {
                            return resolve({ 
                                error: { 
                                    status: 400, 
                                    data: { message: "Amount must be greater than zero" } 
                                } 
                            });
                          }
                          
                          // Update balance
                          wallet.balance += amount;
                          
                          // Add transaction record
                          const newTransaction: ITransaction = {
                              id: "tr-" + Math.random().toString(36).substring(2, 10),
                              amount,
                              type: 'credit',
                              description: 'Added money to wallet',
                              createdAt: new Date().toISOString()
                          };
                          
                          wallet.transactions.unshift(newTransaction);
                          
                          // Save updated wallet
                          saveMockWallet(wallet);
                          
                          resolve({
                              data: {
                                  success: true,
                                  message: `Successfully added $${amount} to your wallet`
                              }
                          });
                        } catch (error: unknown) {
                          // Handle any errors
                          console.error("Failed to add money:", error);
                          resolve({ 
                            error: { 
                              status: 500,
                              data: { message: "Failed to add money to wallet" } 
                            }
                          });
                        }
                    }, 1000);
                });
            },
            invalidatesTags: ["WALLET"],
        }),

        withdrawMoney: builder.mutation<{ success: boolean, message: string }, number>({
            queryFn: (amount) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                          // Get current wallet
                          const wallet = getMockWallet();
                          
                          // Validate amount
                          if (amount <= 0) {
                            return resolve({ 
                                error: { 
                                    status: 400, 
                                    data: { message: "Amount must be greater than zero" } 
                                } 
                            });
                          }
                          
                          // Check balance
                          if (amount > wallet.balance) {
                            return resolve({ 
                                error: { 
                                    status: 400, 
                                    data: { message: "Insufficient balance" } 
                                } 
                            });
                          }
                          
                          // Update balance
                          wallet.balance -= amount;
                          
                          // Add transaction record
                          const newTransaction: ITransaction = {
                              id: "tr-" + Math.random().toString(36).substring(2, 10),
                              amount,
                              type: 'debit',
                              description: 'Withdrawn to bank account',
                              createdAt: new Date().toISOString()
                          };
                          
                          wallet.transactions.unshift(newTransaction);
                          
                          // Save updated wallet
                          saveMockWallet(wallet);
                          
                          resolve({
                              data: {
                                  success: true,
                                  message: `Successfully withdrawn $${amount} from your wallet`
                              }
                          });
                        } catch (error: unknown) {
                          // Handle any errors
                          console.error("Failed to withdraw money:", error);
                          resolve({ 
                            error: { 
                              status: 500,
                              data: { message: "Failed to withdraw money from wallet" } 
                            }
                          });
                        }
                    }, 1000);
                });
            },
            invalidatesTags: ["WALLET"],
        }),

        getWalletTransactions: builder.query<ITransaction[], void>({
            queryFn: () => {
                // Simulate API delay
                return new Promise(resolve => {
                    setTimeout(() => {
                        try {
                          // Get current wallet
                          const wallet = getMockWallet();

                          // Get transactions
                          resolve({ data: wallet.transactions });
                        } catch (error: unknown) {
                          // Handle any errors
                          console.error("Failed to load transaction data:", error);
                          resolve({
                            error: {
                              status: 500,
                              data: { message: "Failed to load transaction data" }
                            }
                          });
                        }
                    }, 500);
                });
            },
            providesTags: ["WALLET"],
        }),
    })
})

export const { useGetWalletQuery, useAddMoneyMutation, useWithdrawMoneyMutation, useGetWalletTransactionsQuery } = riderApi; 