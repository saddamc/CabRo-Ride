import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddMoneyMutation, useGetWalletQuery, useGetWalletTransactionsQuery, useWithdrawMoneyMutation } from "@/redux/features/auth/Rider/rider.api";
import { AlertCircle, CreditCard, DollarSign, Minus, Plus, TrendingDown, TrendingUp, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Wallet() {
  const { data: wallet, isLoading: walletLoading, error: walletError, refetch: refetchWallet } = useGetWalletQuery(undefined);
  const { data: transactions, isLoading: transactionsLoading, error: transactionsError, refetch: refetchTransactions } = useGetWalletTransactionsQuery(undefined);
  const [addMoney, { isLoading: isAddingMoney }] = useAddMoneyMutation();
  const [withdrawMoney, { isLoading: isWithdrawingMoney }] = useWithdrawMoneyMutation();

  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  
  // Calculate today's and this week's earnings from transactions
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Calculate today's earnings
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCredits = transactions
        .filter(t => t.type === 'credit' && new Date(t.createdAt) >= today)
        .reduce((sum, t) => sum + t.amount, 0);
      
      setTodayEarnings(todayCredits);
      
      // Calculate this week's earnings
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
      weekStart.setHours(0, 0, 0, 0);
      
      const weeklyCredits = transactions
        .filter(t => t.type === 'credit' && new Date(t.createdAt) >= weekStart)
        .reduce((sum, t) => sum + t.amount, 0);
      
      setWeeklyEarnings(weeklyCredits);
    }
  }, [transactions]);

  // Handle automatic refresh of data
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchWallet();
      refetchTransactions();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [refetchWallet, refetchTransactions]);

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addMoney(parseFloat(addAmount)).unwrap();
      toast.success("Money added successfully!");
      setAddAmount("");
      
      // Refresh wallet data immediately
      refetchWallet();
      refetchTransactions();
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to add money");
    }
  };

  const handleWithdrawMoney = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(withdrawAmount) > (wallet?.balance || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      await withdrawMoney(parseFloat(withdrawAmount)).unwrap();
      toast.success("Money withdrawn successfully!");
      setWithdrawAmount("");
      
      // Refresh wallet data immediately
      refetchWallet();
      refetchTransactions();
    } catch (error) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to withdraw money");
    }
  };

  // Filter transactions based on time filter
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    const now = new Date();
    
    switch (timeFilter) {
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return transactions.filter(t => new Date(t.createdAt) >= today);
      }
        
      case 'week': {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return transactions.filter(t => new Date(t.createdAt) >= weekStart);
      }
        
      case 'month': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactions.filter(t => new Date(t.createdAt) >= monthStart);
      }
        
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  if (walletError || transactionsError) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-950">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load wallet information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-white dark:bg-gray-950">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Wallet</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your earnings and transactions</p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {walletLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">${wallet?.balance?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Available to spend</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">From completed rides</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {transactionsLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">${weeklyEarnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Weekly earnings</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Money */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Add Money
            </CardTitle>
            <CardDescription>Add funds to your wallet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount ($)</Label>
              <Input
                id="add-amount"
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="0"
                step="0.01"
                className="bg-white dark:bg-gray-900"
              />
            </div>
            <Button 
              onClick={handleAddMoney} 
              className="w-full" 
              disabled={!addAmount || isAddingMoney}
            >
              {isAddingMoney ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Money
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw Money */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-600" />
              Withdraw Money
            </CardTitle>
            <CardDescription>Transfer money to your bank account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount ($)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="0"
                step="0.01"
                max={wallet?.balance || 0}
                className="bg-white dark:bg-gray-900"
              />
              {wallet && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Available: ${wallet.balance.toFixed(2)}
                </p>
              )}
            </div>
            <Button
              onClick={handleWithdrawMoney}
              variant="outline"
              className="w-full"
              disabled={
                !withdrawAmount || 
                parseFloat(withdrawAmount) > (wallet?.balance || 0) || 
                isWithdrawingMoney
              }
            >
              {isWithdrawingMoney ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Withdraw
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your wallet transaction history</CardDescription>
          </div>
          
          <div className="flex items-center">
            <Select
              value={timeFilter}
              onValueChange={setTimeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          ) : filteredTransactions && filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'credit'
                        ? 'bg-green-100 dark:bg-green-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === 'credit' ? "success" : "destructive"} className="capitalize">
                      {transaction.type}
                    </Badge>
                    <div className={`font-semibold ${
                      transaction.type === 'credit'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
              <WalletIcon className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-lg font-medium">No transactions found</p>
              {timeFilter !== 'all' && (
                <p className="text-sm">Try changing your filter or add money to your wallet</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}