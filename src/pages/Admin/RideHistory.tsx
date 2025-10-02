import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllRideQuery } from "@/redux/features/ride-api";
import { Car, ChevronLeft, ChevronRight, Clock, DollarSign, Filter, MapPin, Navigation, Phone, Search, User } from "lucide-react";
import { useMemo, useState } from "react";

interface IRide {
  _id: string;
  rider: {
    _id: string;
    name: string;
    phone: string;
    profilePicture?: string;
    email?: string;
  };
  driver?: {
    _id: string;
    user: {
      name: string;
      phone: string;
      profilePicture?: string;
    };
  };
  pickupLocation: {
    address: string;
    coordinates: [number, number];
  };
  destinationLocation: {
    address: string;
    coordinates: [number, number];
  };
  status: string;
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    totalFare: number;
  };
  distance: {
    estimated: number;
    actual: number;
  };
  duration: {
    estimated: number;
    actual: number;
  };
  createdAt: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export default function AdminRideHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: ridesData, isLoading, error } = useGetAllRideQuery({
    page: currentPage,
    limit: 12
  });

  console.log('Rides data:', ridesData);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  // Client-side filtering
  const filteredRides = useMemo(() => {
    if (!ridesData?.data) return [];

    let filtered = ridesData.data;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(ride => ride.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ride =>
        ride.rider?.name?.toLowerCase().includes(term) ||
        ride.driver?.user?.name?.toLowerCase().includes(term) ||
        ride.pickupLocation?.address?.toLowerCase().includes(term) ||
        ride.destinationLocation?.address?.toLowerCase().includes(term) ||
        ride._id.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [ridesData, filterStatus, searchTerm]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "picked_up":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "requested":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };


  // Pagination
  const totalPages = ridesData?.meta?.totalPages || 1;
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-white text-black py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">🚗 Ride Management</h1>
          <p className="text-gray-600 text-lg">Monitor and manage all rides in your platform</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Total Rides</p>
                  <p className="text-3xl font-bold text-gray-900">{ridesData?.meta?.total || 0}</p>
                </div>
                <div className="bg-gray-200 p-3 rounded-full">
                  <Car className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredRides.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-gray-200 p-3 rounded-full">
                  <Navigation className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${filteredRides
                      .filter(r => r.status === 'completed')
                      .reduce((sum, r) => sum + (r.fare?.totalFare || 0), 0)
                      .toFixed(0)}
                  </p>
                </div>
                <div className="bg-gray-200 p-3 rounded-full">
                  <DollarSign className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700 font-medium">Cancelled</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredRides.filter(r => r.status === 'cancelled').length}
                  </p>
                </div>
                <div className="bg-gray-200 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-gray-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by rider, driver, location, or ride ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48 bg-white border-gray-300 text-black">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="requested">Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Rides Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredRides.length > 0 ? (
            filteredRides.map((ride: IRide) => (
              <Card key={ride._id} className="hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Ride #{ride._id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <Badge className={`${getStatusColor(ride.status)} border`}>
                      {ride.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    {formatDate(ride.createdAt)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rider Info */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{ride.rider?.name || 'Unknown Rider'}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        {ride.rider?.phone || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Driver Info */}
                  {ride.driver ? (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ride.driver.user?.name || 'Unknown Driver'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {ride.driver.user?.phone || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-500">No driver assigned</p>
                    </div>
                  )}

                  {/* Route */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-medium text-gray-900">{ride.pickupLocation?.address || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium text-gray-900">{ride.destinationLocation?.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-bold text-gray-900">
                        {ride.distance?.actual ? `${ride.distance.actual.toFixed(1)} km` : 'N/A'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-bold text-gray-900">
                        {ride.duration?.actual ? `${Math.floor(ride.duration.actual / 60)}m ${ride.duration.actual % 60}s` : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Fare */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Total Fare</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${ride.fare?.totalFare?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Payment</p>
                      <p className="font-medium text-gray-900">
                        {ride.paymentMethod || 'Cash'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={currentPage === pageNum
                      ? "bg-gray-800 text-white hover:bg-gray-900"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Showing {filteredRides.length} of {ridesData?.meta?.total || 0} rides •
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
}