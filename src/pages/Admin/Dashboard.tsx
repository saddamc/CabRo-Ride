import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarIcon, DollarSignIcon, MapIcon, TrendingUp, UserIcon, Users } from "lucide-react";

export default function AdminDashboard() {
  // Mock data for analytics
  const analyticsData = {
    totalUsers: 12847,
    activeRiders: 8234,
    activeDrivers: 1203,
    totalRides: 254862,
    completedRides: 248723,
    cancelledRides: 6139,
    totalRevenue: 3547628.50,
    weeklyGrowth: 8.2,
    monthlyGrowth: 22.4,
    popularDestinations: [
      { name: "Central Business District", count: 3287 },
      { name: "International Airport", count: 2154 },
      { name: "Downtown Shopping Mall", count: 1876 },
      { name: "University Campus", count: 1654 },
      { name: "Tech Park", count: 1432 }
    ],
    revenueByDay: [
      { day: "Mon", amount: 42580 },
      { day: "Tue", amount: 38760 },
      { day: "Wed", amount: 45980 },
      { day: "Thu", amount: 56740 },
      { day: "Fri", amount: 78920 },
      { day: "Sat", amount: 92340 },
      { day: "Sun", amount: 67890 }
    ]
  };
  
  return (
    <div className="container mx-auto py-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Analytics and overview of your platform</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="this-week">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>Export Report</Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12.5%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-green-600">+124</span> new users this week
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-full bg-green-100">
                <CarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8.3%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Rides</p>
              <p className="text-2xl font-bold">{analyticsData.totalRides.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-green-600">+1,245</span> rides this week
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSignIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+15.2%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">
                ${(analyticsData.totalRevenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-green-600">+$45.2K</span> this week
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 rounded-full bg-red-100">
                <MapIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+5.7%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Drivers</p>
              <p className="text-2xl font-bold">{analyticsData.activeDrivers.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium text-green-600">+32</span> new drivers this week
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card className="border-0 shadow-md mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Weekly revenue breakdown</CardDescription>
            </div>
            <Tabs defaultValue="weekly" className="w-[250px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Revenue Chart - we'll simulate with a div */}
          <div className="w-full h-80 bg-gray-50 rounded-lg border border-gray-100 mt-4 flex items-end justify-between p-6">
            {analyticsData.revenueByDay.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="w-16 bg-primary/80 rounded-t-sm hover:bg-primary transition-all"
                  style={{ height: `${(item.amount / 100000) * 250}px` }}
                ></div>
                <span className="text-xs mt-2">{item.day}</span>
                <span className="text-xs text-gray-500">${(item.amount/1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Platform Statistics and Popular Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
            <CardDescription>Key metrics about your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Active Riders</span>
                  </div>
                  <div className="text-lg font-semibold">{analyticsData.activeRiders.toLocaleString()}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-green-100">
                      <CarIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Active Drivers</span>
                  </div>
                  <div className="text-lg font-semibold">{analyticsData.activeDrivers.toLocaleString()}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-purple-100">
                      <CarIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">Completed Rides</span>
                  </div>
                  <div className="text-lg font-semibold">{analyticsData.completedRides.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-red-100">
                      <CarIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium">Cancelled Rides</span>
                  </div>
                  <div className="text-lg font-semibold">{analyticsData.cancelledRides.toLocaleString()}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-yellow-100">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium">Weekly Growth</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">+{analyticsData.weeklyGrowth}%</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-orange-100">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">Monthly Growth</span>
                  </div>
                  <div className="text-lg font-semibold text-green-600">+{analyticsData.monthlyGrowth}%</div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-4">Completion Rate</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(analyticsData.completedRides / analyticsData.totalRides) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Total: {analyticsData.totalRides.toLocaleString()}</span>
                <span className="text-green-600 font-medium">
                  {((analyticsData.completedRides / analyticsData.totalRides) * 100).toFixed(1)}% Completion
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>Most requested drop-off points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.popularDestinations.map((destination, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{destination.name}</span>
                  </div>
                  <div className="text-sm text-gray-500">{destination.count} rides</div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6">
              View Detailed Reports
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary"></div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">New driver registered</h4>
                <span className="text-sm text-gray-500">12 mins ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Michael Brown registered as a new driver with a 2022 Toyota Camry
              </p>
            </div>
            
            <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Driver approved</h4>
                <span className="text-sm text-gray-500">43 mins ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Admin approved Samantha Lee's driver application
              </p>
            </div>
            
            <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-yellow-500"></div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Payment system issue</h4>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Payment gateway reported temporary issues processing credit cards. Resolved now.
              </p>
            </div>
            
            <div className="relative pl-8 pb-6 border-l-2 border-gray-200">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">New promotion created</h4>
                <span className="text-sm text-gray-500">5 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                "Weekend Special" promotion was created with 15% off all rides
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500"></div>
              <div className="flex items-center justify-between">
                <h4 className="font-medium">User account suspended</h4>
                <span className="text-sm text-gray-500">Yesterday</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Rider account was suspended due to multiple ride cancellations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}