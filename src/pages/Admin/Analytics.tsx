import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAdminAnalyticsQuery, useGetAllUsersQuery, useGetBookingsDataQuery, useGetEarningsDataQuery } from "@/redux/features/auth/Admin/admin.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { AlertCircle, ArrowDown, ArrowUp, Car, CircleDollarSign, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Generate last 6 months for date ranges
const getLastSixMonths = () => {
  const months = [];
  const date = new Date();
  for (let i = 0; i < 6; i++) {
    const month = new Date(date);
    month.setMonth(date.getMonth() - i);
    months.unshift({
      name: month.toLocaleString('default', { month: 'short' }),
      fullName: month.toLocaleString('default', { month: 'long' }),
      year: month.getFullYear(),
      value: 0,
    });
  }
  return months;
};

const Analytics = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useGetAdminAnalyticsQuery({});
  const { isLoading: usersLoading } = useGetAllUsersQuery({});
  const { data: bookingsData, isLoading: bookingsLoading } = useGetBookingsDataQuery({});
  const { isLoading: earningsLoading } = useGetEarningsDataQuery({});

  const [timeRange, setTimeRange] = useState('thisMonth');
  const [revenueData, setRevenueData] = useState(getLastSixMonths());

  // Prepare data when API responses come in
  useEffect(() => {
    if (bookingsData) {
      try {
        // Process booking data for charts
        const lastSixMonths = getLastSixMonths();
        
        // This would normally come from an API but for now let's generate mock revenue data
        const mockMonthlyRevenue = lastSixMonths.map(month => ({
          ...month,
          value: Math.floor(Math.random() * 40000) + 10000, // Use value instead of revenue
          bookings: Math.floor(Math.random() * 200) + 50,
        }));
        
        setRevenueData(mockMonthlyRevenue);
      } catch (error) {
        console.error("Error processing booking data:", error);
        toast.error("Failed to process booking data");
      }
    }
  }, [bookingsData]);

  // Get statistics from API or fallback to mock data
  const stats = analyticsData?.data || {
    users: {
      totalUsers: 1249,
      activeUsers: 843,
      blockedUsers: 24
    },
    drivers: {
      totalDrivers: 356,
      approvedDrivers: 289,
      pendingDrivers: 67
    },
    rides: {
      totalRides: 2390,
      completedRides: 2156,
      cancelledRides: 234
    }
  };

  // Calculate percentages for stats
  const userActivePercent = stats.users.totalUsers ? Math.round((stats.users.activeUsers / stats.users.totalUsers) * 100) : 0;
  const driverApprovedPercent = stats.drivers.totalDrivers ? Math.round((stats.drivers.approvedDrivers / stats.drivers.totalDrivers) * 100) : 0;
  const ridesCompletedPercent = stats.rides.totalRides ? Math.round((stats.rides.completedRides / stats.rides.totalRides) * 100) : 0;

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.value || 0), 0);
  
  // Mock year-over-year data for comparative statistics
  const yearOverYearGrowth = {
    users: 24,
    drivers: 18,
    rides: 36,
    revenue: 29
  };

  // Calculate sparklines data points
  const userSparkline = [420, 480, 510, 560, 590, 640, 710, 790, 840];
  const driverSparkline = [120, 140, 170, 190, 220, 270, 310, 340, 380];
  const ridesSparkline = [380, 430, 470, 520, 580, 650, 720, 780, 820];

  // Driver type distribution data
  const driverTypeData = [
    { name: 'Sedan', value: 35 },
    { name: 'SUV', value: 25 },
    { name: 'Premium', value: 20 },
    { name: 'Minivan', value: 15 },
    { name: 'Electric', value: 5 },
  ];

  // Ride distribution by time of day
  const rideTimeDistribution = [
    { time: '6am-9am', rides: 450 },
    { time: '9am-12pm', rides: 320 },
    { time: '12pm-3pm', rides: 380 },
    { time: '3pm-6pm', rides: 520 },
    { time: '6pm-9pm', rides: 650 },
    { time: '9pm-12am', rides: 420 },
    { time: '12am-6am', rides: 180 },
  ];

  // Top user activity
  const userActivityData = [
    { activity: 'New Registrations', value: stats.users.totalUsers - stats.users.activeUsers },
    { activity: 'Active Users', value: stats.users.activeUsers },
    { activity: 'Rides Completed', value: stats.rides.completedRides },
  ];

  const isLoading = analyticsLoading || usersLoading || bookingsLoading || earningsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="container p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back, {userInfo?.data?.name || 'Admin'}! Here's what's happening with your platform.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeRange('thisWeek')}>
            This Week
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('thisMonth')} className={timeRange === 'thisMonth' ? 'bg-primary/10' : ''}>
            This Month
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('thisYear')}>
            This Year
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('allTime')}>
            All Time
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.users.totalUsers.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  <div className={`text-xs ${yearOverYearGrowth.users > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {yearOverYearGrowth.users > 0 ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />}
                    {Math.abs(yearOverYearGrowth.users)}%
                  </div>
                  <p className="text-xs text-muted-foreground">vs last year</p>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userSparkline.map((val, i) => ({ value: val, index: i }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Active Users</span>
                <span className="text-xs font-medium">{userActivePercent}%</span>
              </div>
              <Progress value={userActivePercent} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Drivers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.drivers.totalDrivers.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  <div className={`text-xs ${yearOverYearGrowth.drivers > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {yearOverYearGrowth.drivers > 0 ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />}
                    {Math.abs(yearOverYearGrowth.drivers)}%
                  </div>
                  <p className="text-xs text-muted-foreground">vs last year</p>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={driverSparkline.map((val, i) => ({ value: val, index: i }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Approved Drivers</span>
                <span className="text-xs font-medium">{driverApprovedPercent}%</span>
              </div>
              <Progress value={driverApprovedPercent} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Rides Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.rides.totalRides.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  <div className={`text-xs ${yearOverYearGrowth.rides > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {yearOverYearGrowth.rides > 0 ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />}
                    {Math.abs(yearOverYearGrowth.rides)}%
                  </div>
                  <p className="text-xs text-muted-foreground">vs last year</p>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ridesSparkline.map((val, i) => ({ value: val, index: i }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Completed Rides</span>
                <span className="text-xs font-medium">{ridesCompletedPercent}%</span>
              </div>
              <Progress value={ridesCompletedPercent} className="h-1" />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1">
                  <div className={`text-xs ${yearOverYearGrowth.revenue > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {yearOverYearGrowth.revenue > 0 ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />}
                    {Math.abs(yearOverYearGrowth.revenue)}%
                  </div>
                  <p className="text-xs text-muted-foreground">vs last year</p>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData.map((item) => ({ month: item.name, value: item.value / 1000 }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Bar dataKey="value" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Target</span>
                <span className="text-xs font-medium">80%</span>
              </div>
              <Progress value={80} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different view */}
      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users & Drivers</TabsTrigger>
          <TabsTrigger value="rides">Rides & Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="value" stroke="#8884D8" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Driver Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Types Distribution</CardTitle>
                <CardDescription>Distribution by vehicle category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={driverTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                    >
                      {driverTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* User Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Activity Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="activity" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Drivers Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" name="New Users" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Status</CardTitle>
                <CardDescription>Current driver verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Approved</span>
                      <span className="text-sm font-medium">{stats.drivers.approvedDrivers} drivers</span>
                    </div>
                    <Progress value={driverApprovedPercent} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm font-medium">{stats.drivers.pendingDrivers} drivers</span>
                    </div>
                    <Progress value={(stats.drivers.pendingDrivers / stats.drivers.totalDrivers) * 100} className="h-2 bg-yellow-100 dark:bg-yellow-900">
                      <div className="h-full bg-yellow-500" style={{ width: `${(stats.drivers.pendingDrivers / stats.drivers.totalDrivers) * 100}%` }} />
                    </Progress>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Average Rating</h3>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4.8/5</div>
                      <div className="flex items-center text-yellow-500 mt-1">
                        ★★★★★
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-medium mb-1">Online Now</h3>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {Math.round(stats.drivers.approvedDrivers * 0.62)}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Active drivers
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rides & Revenue Tab */}
        <TabsContent value="rides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ride Distribution by Time</CardTitle>
                <CardDescription>When users are most active</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={rideTimeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rides" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Conversion</CardTitle>
                <CardDescription>Ratio of completed to cancelled rides</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-6">
                  <ResponsiveContainer width="80%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: stats.rides.completedRides },
                          { name: 'Cancelled', value: stats.rides.cancelledRides }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                      >
                        <Cell fill="#00C49F" />
                        <Cell fill="#FF8042" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium mb-1">Completed</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.rides.completedRides.toLocaleString()}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {ridesCompletedPercent}% success rate
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                    <div className="text-sm font-medium mb-1">Cancelled</div>
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.rides.cancelledRides.toLocaleString()}
                    </div>
                    <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                      {100 - ridesCompletedPercent}% cancel rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;