import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDriverEarningsQuery } from "@/redux/features/driver/driver.api";
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function EarningDashboard() {
  const { data: earnings, isLoading } = useGetDriverEarningsQuery();

  const { dailyData, weeklyData, monthlyData } = useMemo(() => {
    if (!earnings?.history) {
      return {
        dailyData: [],
        weeklyData: [],
        monthlyData: []
      };
    }

    // Process history data
    const history = earnings.history.map(item => ({
      ...item,
      date: new Date(item.createdAt)
    }));

    // Daily data - last 7 days
    const dailyMap = new Map<string, number>();
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dailyMap.set(key, 0);
    }

    history.forEach(item => {
      const key = item.date.toISOString().split('T')[0];
      if (dailyMap.has(key)) {
        dailyMap.set(key, (dailyMap.get(key) || 0) + item.amount);
      }
    });

    const dailyData = Array.from(dailyMap.entries()).map(([date, earnings]) => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      earnings
    }));

    // Weekly data - last 4 weeks
    const weeklyMap = new Map<string, number>();
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()); // Start of current week
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(currentWeek);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const key = weekStart.toISOString().split('T')[0];
      weeklyMap.set(key, 0);
    }

    history.forEach(item => {
      const itemDate = new Date(item.date);
      const weekStart = new Date(itemDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (weeklyMap.has(key)) {
        weeklyMap.set(key, (weeklyMap.get(key) || 0) + item.amount);
      }
    });

    const weeklyData = Array.from(weeklyMap.entries()).map(([, earnings], index) => ({
      week: `Week ${4 - index}`,
      earnings
    }));

    // Monthly data - last 6 months
    const monthlyMap = new Map<string, number>();
    const currentMonth = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - i, 1);
      const key = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, 0);
    }

    history.forEach(item => {
      const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + item.amount);
      }
    });

    const monthlyData = Array.from(monthlyMap.entries()).map(([date, earnings]) => ({
      month: new Date(date + '-01').toLocaleDateString('en-US', { month: 'short' }),
      earnings
    }));

    return { dailyData, weeklyData, monthlyData };
  }, [earnings?.history]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 bg-white min-h-screen text-black">
        <div className="text-center">Loading earnings data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 bg-white min-h-screen text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Earning Dashboard</h1>
        <p className="text-gray-600 mt-2">Visual breakdown of your earnings</p>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Earnings</CardTitle>
              <CardDescription>Your earnings breakdown by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`৳${value}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Earnings</CardTitle>
              <CardDescription>Your earnings breakdown by week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`৳${value}`, 'Earnings']} />
                  <Line type="monotone" dataKey="earnings" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Your earnings breakdown by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`৳${value}`, 'Earnings']} />
                  <Bar dataKey="earnings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{earnings?.totalEarnings || 0}</div>
            <p className="text-xs text-gray-600">Lifetime total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{earnings?.todayEarnings || 0}</div>
            <p className="text-xs text-gray-600">Current day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings?.totalTrips || 0}</div>
            <p className="text-xs text-gray-600">Completed rides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}