import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDriverEarningsQuery } from "@/redux/features/auth/Driver/deletedriver.api";
import { BarChart3, ChevronLeft, ChevronRight, DollarSign, Download, LineChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";

export default function DriverEarnings() {
  const { data: earningsData, isLoading } = useGetDriverEarningsQuery();
  const [dateRange, setDateRange] = useState('week'); // 'day', 'week', 'month'
  const [currentPeriod, setCurrentPeriod] = useState(0);

  // Calculate real earnings data if available
  const calculateEarnings = () => {
    if (!earningsData?.history) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    let dailyTotal = 0;
    let weeklyTotal = 0;
    let monthlyTotal = 0;
    
    earningsData.history.forEach(transaction => {
      const txDate = new Date(transaction.createdAt);
      
      // Daily earnings (today)
      if (txDate >= today) {
        dailyTotal += transaction.amount;
      }
      
      // Weekly earnings (last 7 days)
      if (txDate >= oneWeekAgo) {
        weeklyTotal += transaction.amount;
      }
      
      // Monthly earnings (last 30 days)
      if (txDate >= oneMonthAgo) {
        monthlyTotal += transaction.amount;
      }
    });
    
    return {
      dailyEarnings: dailyTotal,
      weeklyEarnings: weeklyTotal,
      monthlyEarnings: monthlyTotal
    };
  };
  
  const calculatedEarnings = calculateEarnings();
  
  // Mock data for charts and statistics
  const mockEarnings = {
    dailyEarnings: calculatedEarnings?.dailyEarnings || 187.50,
    weeklyEarnings: calculatedEarnings?.weeklyEarnings || 1245.75,
    monthlyEarnings: calculatedEarnings?.monthlyEarnings || 4780.25,
    totalEarnings: earningsData?.totalEarnings || 23450.50,
    completedRides: earningsData?.totalTrips || 325,
    averageRating: 4.85,
    charts: {
      daily: [
        { time: '6 AM', amount: 0 },
        { time: '8 AM', amount: 45.75 },
        { time: '10 AM', amount: 32.50 },
        { time: '12 PM', amount: 28.25 },
        { time: '2 PM', amount: 36.75 },
        { time: '4 PM', amount: 44.25 },
        { time: '6 PM', amount: 0 },
      ],
      weekly: [
        { day: 'Mon', amount: 187.50 },
        { day: 'Tue', amount: 215.25 },
        { day: 'Wed', amount: 165.75 },
        { day: 'Thu', amount: 198.50 },
        { day: 'Fri', amount: 245.25 },
        { day: 'Sat', amount: 175.50 },
        { day: 'Sun', amount: 58.00 },
      ],
      monthly: [
        { week: 'Week 1', amount: 1125.75 },
        { week: 'Week 2', amount: 968.50 },
        { week: 'Week 3', amount: 1245.25 },
        { week: 'Week 4', amount: 1440.75 },
      ],
    },
    transactions: [
      {
        id: 'tr-001',
        date: '2025-09-24',
        time: '14:32',
        amount: 45.75,
        type: 'ride',
        status: 'completed',
        details: 'Ride from Downtown to Uptown'
      },
      {
        id: 'tr-002',
        date: '2025-09-24',
        time: '12:15',
        amount: 32.50,
        type: 'ride',
        status: 'completed',
        details: 'Ride from West End to East Village'
      },
      {
        id: 'tr-003',
        date: '2025-09-24',
        time: '10:08',
        amount: 28.25,
        type: 'ride',
        status: 'completed',
        details: 'Ride from North Point to South Bay'
      },
      {
        id: 'tr-004',
        date: '2025-09-23',
        time: '18:45',
        amount: 36.75,
        type: 'ride',
        status: 'completed',
        details: 'Ride from Central Park to Riverside'
      },
      {
        id: 'tr-005',
        date: '2025-09-23',
        time: '16:22',
        amount: 44.25,
        type: 'ride',
        status: 'completed',
        details: 'Ride from Airport to Downtown'
      },
    ]
  };

  const handlePrevPeriod = () => {
    setCurrentPeriod(prev => prev - 1);
  };

  const handleNextPeriod = () => {
    if (currentPeriod < 0) {
      setCurrentPeriod(prev => prev + 1);
    }
  };

  const getPeriodLabel = () => {
    
    switch (dateRange) {
      case 'day': {
        const dayDate = new Date();
        dayDate.setDate(dayDate.getDate() + currentPeriod);
        return dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      }
      case 'week': {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (currentPeriod * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
      case 'month': {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() + currentPeriod);
        return monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      default:
        return '';
    }
  };
  
  // Calculate current period earnings based on mock data
  const getCurrentPeriodEarnings = () => {
    switch (dateRange) {
      case 'day': {
        return mockEarnings.dailyEarnings;
      }
      case 'week': {
        return mockEarnings.weeklyEarnings;
      }
      case 'month': {
        return mockEarnings.monthlyEarnings;
      }
      default:
        return 0;
    }
  };

  return (
    <div className="container mx-auto py-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Earnings Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-3 text-gray-600">Loading earnings data...</p>
          </div>
        </div>
      ) : (
        <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <p className="text-2xl font-bold">${mockEarnings.totalEarnings.toFixed(2)}</p>
              <p className="text-xs text-green-600">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">${mockEarnings.weeklyEarnings.toFixed(2)}</p>
              <p className="text-xs text-green-600">+5.2% from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Today's Earnings</p>
              <p className="text-2xl font-bold">${mockEarnings.dailyEarnings.toFixed(2)}</p>
              <p className="text-xs text-red-600">-2.3% from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <LineChart className="h-5 w-5 text-yellow-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed Rides</p>
              <p className="text-2xl font-bold">{mockEarnings.completedRides}</p>
              <p className="text-xs text-green-600">+8.7% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Earnings Chart */}
      <Card className="border-0 shadow-md mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Your earnings over time</CardDescription>
            </div>
            <Tabs 
              value={dateRange} 
              onValueChange={setDateRange}
              className="w-[300px]"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="day">Daily</TabsTrigger>
                <TabsTrigger value="week">Weekly</TabsTrigger>
                <TabsTrigger value="month">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">{getPeriodLabel()}</div>
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevPeriod} 
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNextPeriod}
                disabled={currentPeriod >= 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-2xl font-bold">
                ${getCurrentPeriodEarnings().toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {dateRange === 'day' ? 'Today\'s earnings' : 
                 dateRange === 'week' ? 'This week\'s earnings' : 'This month\'s earnings'}
              </div>
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Download Report
            </Button>
          </div>
          
          {/* Chart Visualization - we'll use a div to simulate a chart */}
          <div className="w-full h-72 bg-gray-50 rounded-lg border border-gray-100 mt-4 flex items-end justify-between p-6">
            {dateRange === 'day' && mockEarnings.charts.daily.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-10 bg-primary/80 rounded-t-sm hover:bg-primary transition-all"
                  style={{ height: `${(item.amount / 50) * 150}px` }}
                ></div>
                <span className="text-xs mt-2">{item.time}</span>
              </div>
            ))}
            
            {dateRange === 'week' && mockEarnings.charts.weekly.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-12 bg-primary/80 rounded-t-sm hover:bg-primary transition-all"
                  style={{ height: `${(item.amount / 250) * 150}px` }}
                ></div>
                <span className="text-xs mt-2">{item.day}</span>
              </div>
            ))}
            
            {dateRange === 'month' && mockEarnings.charts.monthly.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-16 bg-primary/80 rounded-t-sm hover:bg-primary transition-all"
                  style={{ height: `${(item.amount / 1500) * 150}px` }}
                ></div>
                <span className="text-xs mt-2">{item.week}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest earnings from completed rides</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ride Details</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {earningsData && earningsData.history ? 
                  // Real data
                  earningsData.history.slice(0, 5).map((transaction) => {
                    const txDate = new Date(transaction.createdAt);
                    return (
                      <tr key={transaction.transactionId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{txDate.toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500">{txDate.toLocaleTimeString()}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div>Ride payment</div>
                          <div className="text-xs text-gray-500">ID: {transaction.transactionId}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-green-600">
                          +${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                            completed
                          </span>
                        </td>
                      </tr>
                    );
                  })
                  : 
                  // Mock data
                  mockEarnings.transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{transaction.date}</div>
                        <div className="text-sm text-gray-500">{transaction.time}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{transaction.details}</div>
                        <div className="text-xs text-gray-500">ID: {transaction.id}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600">
                        +${transaction.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium">
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>
    </>
    )}
    </div>
  );
}