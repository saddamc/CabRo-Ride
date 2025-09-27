import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Download, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";

export default function AdminWallet() {
  // Mock wallet data for admin
  const walletData = {
    balance: 15420.50,
    monthlyIncome: 8750.25,
    monthlyExpenses: 3250.75,
    pendingPayments: 1250.00,
    recentTransactions: [
      {
        id: "TRX-001",
        type: "income",
        amount: 1250.75,
        description: "Platform commission from rides",
        date: "2025-09-25",
        status: "completed"
      },
      {
        id: "TRX-002",
        type: "expense",
        amount: 500.00,
        description: "Server maintenance",
        date: "2025-09-24",
        status: "completed"
      },
      {
        id: "TRX-003",
        type: "income",
        amount: 980.50,
        description: "Premium subscription fees",
        date: "2025-09-23",
        status: "completed"
      },
      {
        id: "TRX-004",
        type: "expense",
        amount: 750.25,
        description: "Marketing campaign",
        date: "2025-09-22",
        status: "pending"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "expense":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Wallet</h1>
        <p className="text-gray-500">Manage system finances and transactions</p>
      </div>

      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">${walletData.balance.toFixed(2)}</p>
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold">${walletData.monthlyIncome.toFixed(2)}</p>
              <p className="text-xs text-green-600">+8.2% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
              <p className="text-2xl font-bold">${walletData.monthlyExpenses.toFixed(2)}</p>
              <p className="text-xs text-red-600">+5.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-2xl font-bold">${walletData.pendingPayments.toFixed(2)}</p>
              <p className="text-xs text-yellow-600">Awaiting approval</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Add Funds</h3>
                <p className="text-sm text-gray-500">Deposit money to wallet</p>
              </div>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Transfer</h3>
                <p className="text-sm text-gray-500">Move funds between accounts</p>
              </div>
              <Button variant="outline" className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Report</h3>
                <p className="text-sm text-gray-500">Download financial report</p>
              </div>
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {walletData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.date} • {transaction.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}