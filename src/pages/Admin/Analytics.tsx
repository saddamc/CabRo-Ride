import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllToursQuery, useGetTourTypesQuery } from "@/redux/features/auth/Tour/tour.api";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for demo purposes
const mockBookingsOverTime = [
  { month: 'Jan', bookings: 400, revenue: 24000 },
  { month: 'Feb', bookings: 300, revenue: 13980 },
  { month: 'Mar', bookings: 500, revenue: 98000 },
  { month: 'Apr', bookings: 280, revenue: 39080 },
  { month: 'May', bookings: 590, revenue: 48000 },
  { month: 'Jun', bookings: 320, revenue: 38000 },
];

const mockUserActivityData = [
  { activity: 'New Registrations', value: 150 },
  { activity: 'Active Users', value: 320 },
  { activity: 'Bookings Made', value: 245 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = () => {
  const { data: toursData, isLoading: toursLoading, error: toursError } = useGetAllToursQuery({});
  const { data: tourTypesData, isLoading: typesLoading, error: typesError } = useGetTourTypesQuery({});

  // Ensure data is treated as arrays, providing fallbacks
  const toursArray = Array.isArray(toursData) ? toursData : [];
  const tourTypesArray = Array.isArray(tourTypesData) ? tourTypesData : [];

  const totalTours = toursArray?.length || 0;
  const totalTourTypes = tourTypesArray?.length || 0;
  const totalBookings = mockBookingsOverTime.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = mockBookingsOverTime.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = mockUserActivityData.reduce((sum, item) => sum + item.value, 0);

  const isLoading = toursLoading || typesLoading;
  const hasError = toursError || typesError;

  if (isLoading) return <div>Loading admin analytics...</div>;
  if (hasError) return <div>Error loading analytics data</div>;

  // Prepare chart data from real tour types with proper fallback
  const tourTypeChartData = tourTypesArray.length > 0
    ? tourTypesArray.map((type, index: number) => ({
        name: type?.name || `Type ${index + 1}`,
        value: 400 - (index * 50) // Mock distribution
      }))
    : [
        { name: 'Adventure', value: 400 },
        { name: 'Cultural', value: 300 },
        { name: 'Beach', value: 200 },
      ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTours}</div>
            <p className="text-xs text-muted-foreground">
              Active tour packages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tour Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTourTypes}</div>
            <p className="text-xs text-muted-foreground">
              Available categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={mockBookingsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884D8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tour Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Types Distribution</CardTitle>
            <CardDescription>Bookings by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={tourTypeChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : '0')}%`}
                >
                  {tourTypeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
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
            <BarChart data={mockUserActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="activity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;