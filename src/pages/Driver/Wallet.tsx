import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, MoreHorizontal, Plus, ReceiptText, Search } from "lucide-react";
import { useState } from "react";

export default function DriverWallet() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock wallet data
  const walletData = {
    balance: 1245.50,
    pendingBalance: 87.50,
    totalEarned: 3450.75,
    transactions: [
      {
        id: "TX789012",
        date: "2023-09-15T10:30:00",
        type: "earning",
        amount: 22.50,
        description: "Ride completion bonus",
        status: "completed"
      },
      {
        id: "TX789011",
        date: "2023-09-15T09:15:00",
        type: "earning",
        amount: 18.75,
        description: "Ride fare: Downtown to Airport",
        status: "completed"
      },
      {
        id: "TX789010",
        date: "2023-09-14T16:45:00",
        type: "withdrawal",
        amount: 150.00,
        description: "Bank transfer",
        status: "completed"
      },
      {
        id: "TX789009",
        date: "2023-09-14T12:20:00",
        type: "earning",
        amount: 24.35,
        description: "Ride fare: Suburban Mall to City Center",
        status: "completed"
      },
      {
        id: "TX789008",
        date: "2023-09-13T18:10:00",
        type: "earning",
        amount: 31.25,
        description: "Ride fare: Airport to Hotel",
        status: "completed"
      },
      {
        id: "TX789007",
        date: "2023-09-12T14:30:00",
        type: "withdrawal",
        amount: 200.00,
        description: "Bank transfer",
        status: "completed"
      }
    ],
    paymentMethods: [
      {
        id: "PM001",
        type: "bank_account",
        name: "Wells Fargo Checking",
        lastFour: "4567",
        isDefault: true
      },
      {
        id: "PM002",
        type: "card",
        name: "Visa Debit",
        lastFour: "8901",
        isDefault: false
      }
    ]
  };

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Driver Wallet</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your earnings and payment methods
        </p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Wallet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/80 to-primary text-white">
              <CardHeader>
                <CardTitle className="text-white">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">${walletData.balance.toFixed(2)}</div>
                <div className="text-primary-foreground/80 mb-4">Available for withdrawal</div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="text-primary">
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                    Add Funds
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white/20">
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/80 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Pending Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">${walletData.pendingBalance.toFixed(2)}</div>
                <div className="text-blue-100 mb-4">Processing and upcoming payouts</div>
                <Button variant="secondary" size="sm" className="text-blue-600">
                  View Details
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/80 to-green-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Total Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">${walletData.totalEarned.toFixed(2)}</div>
                <div className="text-green-100 mb-4">Lifetime earnings</div>
                <Button variant="secondary" size="sm" className="text-green-600">
                  Earnings Report
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common wallet operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                  <ArrowDownIcon className="h-6 w-6" />
                  <span>Withdraw Funds</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                  <ReceiptText className="h-6 w-6" />
                  <span>Tax Documents</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  <span>Add Payment Method</span>
                </Button>
                <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Set Payout Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest financial activity</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("transactions")}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletData.transactions.slice(0, 3).map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'earning' 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {transaction.type === 'earning' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type === 'earning' ? 'Earning' : 'Withdrawal'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`font-medium ${
                        transaction.type === 'earning' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-blue-600 dark:text-blue-400'
                      }`}>
                        {transaction.type === 'earning' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and filter your transaction history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search transactions..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="earning">Earnings</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                {walletData.transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex flex-wrap md:flex-nowrap items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'earning' 
                          ? 'bg-green-100 dark:bg-green-900/20' 
                          : 'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {transaction.type === 'earning' ? (
                          <ArrowUpIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type === 'earning' ? 'Earning' : 'Withdrawal'}
                          <span className="text-xs text-gray-500 ml-2">
                            {transaction.id}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto">
                      <div className="text-sm">{transaction.description}</div>
                      <Badge variant={transaction.status === 'completed' ? 'outline' : 'secondary'} className="mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <div className={`font-medium text-lg ${
                      transaction.type === 'earning' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {transaction.type === 'earning' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <div className="text-sm text-gray-500">
                Showing 1-6 of 24 transactions
              </div>
              <Button variant="outline">
                Next
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your connected payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {walletData.paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {method.type === 'bank_account' ? (
                          <DollarSign className="h-5 w-5 text-primary" />
                        ) : (
                          <CreditCard className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {method.name}
                          {method.isDefault && (
                            <Badge variant="outline" className="ml-2">Default</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.type === 'bank_account' ? 'Account' : 'Card'} ending in {method.lastFour}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      {!method.isDefault && (
                        <Button variant="ghost" size="sm">
                          Set Default
                        </Button>
                      )}
                      {!method.isDefault && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Settings</CardTitle>
              <CardDescription>Configure your payout preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Automatic Payouts</Label>
                  <RadioGroup name="payout-frequency" defaultValue="weekly" className="mt-3">
                    <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <div className="flex-1">
                        <Label htmlFor="weekly" className="font-medium">Weekly</Label>
                        <div className="text-sm text-gray-500">
                          Receive payouts automatically every Monday for the previous week's earnings
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <div className="flex-1">
                        <Label htmlFor="monthly" className="font-medium">Monthly</Label>
                        <div className="text-sm text-gray-500">
                          Receive payouts automatically on the 1st of each month for the previous month's earnings
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-4">
                      <RadioGroupItem value="manual" id="manual" />
                      <div className="flex-1">
                        <Label htmlFor="manual" className="font-medium">Manual</Label>
                        <div className="text-sm text-gray-500">
                          Withdraw your earnings manually whenever you want
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label className="text-base">Minimum Payout Amount</Label>
                  <Select defaultValue="50">
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">$25.00</SelectItem>
                      <SelectItem value="50">$50.00</SelectItem>
                      <SelectItem value="100">$100.00</SelectItem>
                      <SelectItem value="200">$200.00</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-gray-500 mt-1">
                    Payouts will only process when your balance exceeds this amount
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
          
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertTitle>Instant Cashout Available</AlertTitle>
            <AlertDescription>
              You can now instantly transfer your earnings to your bank account for a small fee. 
              <Button variant="link" className="p-0 h-auto font-normal" size="sm">
                Learn more
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Fleet Options</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Choose the best fleet option for your driving needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Fleet Card */}
            <Card className="border-2 border-blue-500 dark:border-blue-400">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                <div className="flex justify-between items-center">
                  <CardTitle>Top Fleet</CardTitle>
                  <Badge className="bg-blue-500">Premium</Badge>
                </div>
                <CardDescription>Premium vehicle service</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">$24.99<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-sm text-gray-500 mb-4">Best for luxury vehicles</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Higher fare rates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Priority ride matching
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Exclusive high-end clients
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Select Plan</Button>
              </CardFooter>
            </Card>
            
            {/* Standard Fleet Card */}
            <Card className="border-2 border-green-500 dark:border-green-400">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <div className="flex justify-between items-center">
                  <CardTitle>Fleet</CardTitle>
                  <Badge className="bg-green-500">Popular</Badge>
                </div>
                <CardDescription>Standard vehicle service</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">$14.99<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-sm text-gray-500 mb-4">For most vehicles</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Standard fare rates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Regular ride matching
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    24/7 support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-green-500 hover:bg-green-600">Select Plan</Button>
              </CardFooter>
            </Card>
            
            {/* Prime Fleet Card */}
            <Card className="border-2 border-purple-500 dark:border-purple-400">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20">
                <div className="flex justify-between items-center">
                  <CardTitle>Prime</CardTitle>
                  <Badge className="bg-purple-500">Exclusive</Badge>
                </div>
                <CardDescription>Elite vehicle service</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold mb-1">$39.99<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-sm text-gray-500 mb-4">For elite drivers</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Premium fare rates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    VIP ride matching
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Dedicated account manager
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-500 hover:bg-purple-600">Select Plan</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Alert className="bg-white dark:bg-white border-gray-200 dark:border-gray-700">
            <AlertTitle>Fleet Service Benefits</AlertTitle>
            <AlertDescription>
              Joining our fleet service provides you with better earning opportunities, priority customer matching, and exclusive promotions.
              <Button variant="link" className="p-0 h-auto font-normal" size="sm">
                Compare all benefits
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}