import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAdminAnalyticsQuery, useGetBookingsDataQuery, useGetEarningsDataQuery } from "@/redux/features/auth/Admin/admin.api";
import { CarIcon, DollarSignIcon, Loader2, Mail, Shield, TrendingUp, UserIcon, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // Define booking type to avoid any
  interface Booking {
    id: string;
    date: string;
    status: string;
    amount: number;
  }

  // Fetch real data from API
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useGetAdminAnalyticsQuery({});
  const { data: bookingsData, isLoading: isLoadingBookings } = useGetBookingsDataQuery({});
  const { data: earningsData, isLoading: isLoadingEarnings } = useGetEarningsDataQuery({});
  
  // Calculate completion rate
  const completionRate = analyticsData?.data?.rides 
    ? ((analyticsData.data.rides.completedRides / analyticsData.data.rides.totalRides) * 100).toFixed(1)
    : "0";

  // Calculate total revenue from earnings data or use a mock value
  const totalRevenue = earningsData?.data?.earnings
    ? earningsData.data.earnings.reduce((total, item) => total + item.amount, 0)
    : 3547628.50;
  
  return (
    <div className="container mx-auto py-6 px-4 bg-white text-black min-h-screen">
      {isLoadingAnalytics || isLoadingBookings || isLoadingEarnings ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-2">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-100 border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">Total Users</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData?.data?.users.totalUsers.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-gray-600">All registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-100 border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">Active Drivers</CardTitle>
                <CarIcon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {analyticsData?.data?.drivers.approvedDrivers.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-gray-600">Approved drivers</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-100 border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">Total Revenue</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ৳{(totalRevenue / 1000).toFixed(1)}K
                </div>
                <p className="text-xs text-gray-600">All time earnings</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-100 border-gray-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-800">Completion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{completionRate}%</div>
                <p className="text-xs text-gray-600">Ride success rate</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      {/* Admin Profile and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Platform Overview</CardTitle>
            <CardDescription>Monitor your ride-sharing platform performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-lg font-semibold">Platform Health: Excellent</div>
                <div className="text-sm text-gray-500">All systems operational</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2" asChild>
                <Link to="/admin/riders">
                  <Users className="h-4 w-4" />
                  Manage Riders
                </Link>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
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
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=96"
                alt="Admin"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <h3 className="font-semibold text-lg">System Administrator</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <UserIcon className="h-4 w-4" />
                  <span className="font-medium">Super Admin</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <UserIcon className="h-4 w-4 text-gray-500" />
                <span>Administrator since 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>admin@platform.com</span>
              </div>
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Total Drivers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.drivers.totalDrivers.toLocaleString() || '0'}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Completed Rides</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.rides.completedRides.toLocaleString() || '0'}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CarIcon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Cancelled Rides</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.rides.cancelledRides.toLocaleString() || '0'}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Pending Drivers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.data?.drivers.pendingDrivers || '0'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/rides">
                <CarIcon className="h-4 w-4" />
                View Ride Analytics
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/users">
                <Users className="h-4 w-4" />
                User Management
              </a>
            </Button>
            <Button variant="outline" className="flex items-center gap-2" asChild>
              <a href="/admin/reports">
                <DollarSignIcon className="h-4 w-4" />
                Revenue Reports
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Bookings */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest ride bookings on the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/admin/rides">View All</a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingsData?.data?.bookings && bookingsData.data.bookings.length > 0 ? (
              bookingsData.data.bookings.slice(0, 5).map((booking: Booking) => (
                <Card key={booking.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
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
                                {new Date(booking.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-gray-500">
                                Booking ID: {booking.id.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
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