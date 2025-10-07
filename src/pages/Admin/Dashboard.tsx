/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useGetAdminAnalyticsQuery,
  useGetBookingsDataQuery,
  useGetDriverActivityDataQuery,
  useGetEarningsDataQuery,
  useGetRideVolumeDataQuery
} from "@/redux/features/auth/Admin/admin.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  CarIcon,
  DollarSignIcon,
  Loader2,
  Mail,
  Shield,
  TrendingUp,
  User,
  UserIcon,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  // Define booking type to avoid any
  interface Booking {
    id: string;
    date: string;
    status: string;
    amount: number;
  }

  // Fetch real data from API
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useGetAdminAnalyticsQuery({});
  const { data: bookingsData, isLoading: isLoadingBookings } =
    useGetBookingsDataQuery({});
  const { data: earningsData, isLoading: isLoadingEarnings } =
    useGetEarningsDataQuery({});
  const { data: rideVolumeData } = useGetRideVolumeDataQuery();
  const { data: driverActivityData } = useGetDriverActivityDataQuery();
  const { data: userInfo, isLoading: isUserInfoLoading } =
    useUserInfoQuery(undefined);

  // Calculate completion rate
  const completionRate = analyticsData?.data?.rides
    ? (
        (analyticsData.data.rides.completedRides /
          analyticsData.data.rides.totalRides) *
        100
      ).toFixed(1)
    : "0";

  // Calculate total revenue from earnings data or use a mock value
  const totalRevenue = earningsData?.data?.earnings
    ? earningsData.data.earnings.reduce((total, item) => total + item.amount, 0)
    : 3547628.5;

  // Use real data when available, fallback to mock data
  const processedRideVolumeData = rideVolumeData?.data || Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      rides: Math.floor(Math.random() * 500) + 200 + Math.sin(i / 5) * 100,
      completed: Math.floor(
        (Math.floor(Math.random() * 500) + 200 + Math.sin(i / 5) * 100) * 0.85
      ),
      cancelled: Math.floor(
        (Math.floor(Math.random() * 500) + 200 + Math.sin(i / 5) * 100) * 0.15
      ),
    };
  });

  // Use real earnings data when available, fallback to mock data
  const processedRevenueData = earningsData?.data?.earnings?.map(item => ({
    month: item.month,
    revenue: item.amount,
    bookings: Math.floor(Math.random() * 500) + 1000, // Mock bookings for now
  })) || Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (11 - i));
    return {
      month: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      revenue: Math.floor(Math.random() * 50000) + 50000 + Math.sin(i / 3) * 20000,
      bookings: Math.floor(Math.random() * 500) + 1000,
    };
  });

  // Use real driver activity data when available, fallback to mock data
  const processedDriverActivityData = driverActivityData?.data || Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    activeDrivers: Math.floor(Math.random() * 50) + 20 + Math.sin(i / 4) * 20,
    bookings: Math.floor(Math.random() * 30) + 10 + Math.sin(i / 4) * 15,
  }));

  const rideStatusData = [
    {
      name: "Completed",
      value: analyticsData?.data?.rides?.completedRides ?? 85,
      color: "#10b981",
    },
    {
      name: "Cancelled",
      value: analyticsData?.data?.rides?.cancelledRides ?? 10,
      color: "#ef4444",
    },
    {
      name: "Ongoing",
      value:
        (analyticsData?.data?.rides?.totalRides ?? 0) -
        (analyticsData?.data?.rides?.completedRides ?? 0) -
        (analyticsData?.data?.rides?.cancelledRides ?? 0),
      color: "#f59e0b",
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4 bg-white text-black min-h-screen">
      {/* Data Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Ride Volume Chart */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Ride Volume Trends
            </CardTitle>
            <CardDescription>
              Daily ride bookings over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedRideVolumeData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    fontSize: "14px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "600" }}
                />
                <Line
                  type="monotone"
                  dataKey="rides"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#1d4ed8",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trends Chart */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSignIcon className="h-5 w-5 text-amber-500" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue and booking volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedRevenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    fontSize: "14px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "600" }}
                  formatter={(value: any, name: any) => [
                    name === "revenue"
                      ? `৳${value.toLocaleString()}`
                      : value.toLocaleString(),
                    name === "revenue" ? "Revenue" : "Bookings",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Activity and Ride Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Driver Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Driver Activity (24h)</CardTitle>
            <CardDescription>
              Active drivers and bookings by hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedDriverActivityData}>
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8f9fa",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="activeDrivers"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar dataKey="bookings" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Ride Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Status Distribution</CardTitle>
            <CardDescription>Current ride completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rideStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {rideStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Admin Profile and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>
              Monitor your ride-sharing platform performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  Platform Health: Excellent
                </div>
                <div className="text-sm text-gray-500">
                  All systems operational
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2" asChild>
                <Link to="/admin/riders">
                  <Users className="h-4 w-4" />
                  Manage Riders
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/admin/drivers">
                  <CarIcon className="h-4 w-4" />
                  Manage Drivers
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="flex items-center">
              <div>
                {isUserInfoLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
                    </div>
                    <div className="w-2/3 h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                      {userInfo?.data?.profilePicture ? (
                        <img
                          src={userInfo.data.profilePicture}
                          alt="Profile"
                          className="h-24 w-24 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                  </>
                )}
              </div>

              

              <div className="ml-4">
                <h2 className="text-xl font-bold">
                  {userInfo?.data?.name || "User Name"}
                </h2>

                <div className="flex items-center gap-1 mt-2 mb-4 text-yellow-700">
                  <UserIcon className="h-4 w-4" />

                  <span className="px-2 py-1 font-bold bg-yellow-200 text-yellow-700 rounded-full text-xs uppercase">
                    {userInfo?.data?.role || ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-500">
                <UserIcon className="h-4 w-4" />
                Administrator since {userInfo?.data?.createdAt 
                        ? new Date(userInfo.data.createdAt).toLocaleDateString() 
                        : 'August 2023'}
              </p>


              <p className="flex items-center gap-2 text-gray-500">
                <Mail className="h-4 w-4 text-gray-500" />

                {userInfo?.data?.email || "user@example.com"}
              </p>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">Full Access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Key metrics and recent activity</CardDescription>
        </CardHeader>

        {isLoadingAnalytics || isLoadingBookings || isLoadingEarnings ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-2">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Admin Stats */}
            <div className="grid grid-cols-1 px-5 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-green-100 border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold  text-gray-900">
                    {analyticsData?.data?.users.totalUsers.toLocaleString() ||
                      "0"}
                  </div>
                  <p className="text-xs text-gray-600">All registered users</p>
                </CardContent>
              </Card>

              <Card className="bg-green-300 border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Active Drivers
                  </CardTitle>
                  <CarIcon className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {analyticsData?.data?.drivers.approvedDrivers.toLocaleString() ||
                      "0"}
                  </div>
                  <p className="text-xs text-gray-600">Approved drivers</p>
                </CardContent>
              </Card>

              <Card className="bg-sky-200 border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Total Revenue
                  </CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    ৳{(totalRevenue / 1000).toFixed(1)}K
                  </div>
                  <p className="text-xs text-gray-600">All time earnings</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-100 border-gray-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-800">
                    Completion Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {completionRate}%
                  </div>
                  <p className="text-xs text-gray-600">Ride success rate</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-[#a9ff68] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Total Drivers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.drivers.totalDrivers.toLocaleString() ||
                  "0"}
              </p>
            </div>

            <div className="bg-[#00ff87] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Completed Rides</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.rides.completedRides.toLocaleString() ||
                  "0"}
              </p>
            </div>

            <div className="bg-[#ff5e00] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Cancelled Rides</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.rides.cancelledRides.toLocaleString() ||
                  "0"}
              </p>
            </div>

            <div className="bg-[#f89b29] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Pending Drivers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.drivers.pendingDrivers || "0"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <a href="/admin/rides">
                <CarIcon className="h-4 w-4" />
                View Ride Analytics
              </a>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <a href="/admin/users">
                <Users className="h-4 w-4" />
                User Management
              </a>
            </Button>
            {/* <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <a href="/admin/reports">
                <DollarSignIcon className="h-4 w-4" />
                Revenue Reports
              </a>
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Latest ride bookings on the platform
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/admin/rides">View All</a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingsData?.data?.bookings &&
            bookingsData.data.bookings.length > 0 ? (
              bookingsData.data.bookings.slice(0, 5).map((booking: Booking) => (
                <Card
                  key={booking.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Booking Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <UserIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {new Date(booking.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Booking ID: {booking.id.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </div>

                      {/* Fare */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          ৳{booking.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="p-3 bg-gray-100 inline-block rounded-full mb-3">
                  <CarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
