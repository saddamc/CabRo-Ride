import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllRideQuery } from "@/redux/features/ride-api";
import { Car, ChevronLeft, ChevronRight, Clock, DollarSign, Navigation, Search, Table, UserIcon } from "lucide-react";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [riderName, setRiderName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: ridesData, isLoading, error } = useGetAllRideQuery({
    page: currentPage,
    limit: 12
  });

  // Handle authentication errors gracefully
  const hasAuthError = error || !ridesData;

  // Mock data for demonstration when no data is available
  const mockRidesData = {
    data: [
      {
        _id: "mock1",
        rider: { _id: "r1", name: "John Doe", phone: "+1234567890", profilePicture: "" },
        driver: { _id: "d1", user: { name: "Mike Johnson", phone: "+0987654321", profilePicture: "" } },
        pickupLocation: { address: "123 Main St, City", coordinates: [0, 0] },
        destinationLocation: { address: "456 Oak Ave, City", coordinates: [0, 0] },
        status: "completed",
        fare: { baseFare: 20, distanceFare: 3.5, timeFare: 2, totalFare: 25.50, currency: "USD" },
        distance: { estimated: 12, actual: 12.5 },
        duration: { estimated: 1800, actual: 1800 },
        timestamps: { requested: new Date().toISOString(), completed: new Date().toISOString() },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: "cash",
        paymentStatus: "paid"
      },
      {
        _id: "mock2",
        rider: { _id: "r2", name: "Jane Smith", phone: "+1234567891", profilePicture: "" },
        driver: { _id: "d2", user: { name: "Sarah Wilson", phone: "+0987654322", profilePicture: "" } },
        pickupLocation: { address: "789 Pine St, City", coordinates: [0, 0] },
        destinationLocation: { address: "321 Elm St, City", coordinates: [0, 0] },
        status: "in_transit",
        fare: { baseFare: 15, distanceFare: 2.75, timeFare: 1, totalFare: 18.75, currency: "USD" },
        distance: { estimated: 8, actual: 8.2 },
        duration: { estimated: 1200, actual: 1200 },
        timestamps: { requested: new Date(Date.now() - 86400000).toISOString(), pickedUp: new Date(Date.now() - 3600000).toISOString() },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        paymentMethod: "card",
        paymentStatus: "pending"
      }
    ] as unknown as IRide[],
    meta: {
      total: 2,
      page: 1,
      limit: 12,
      totalPages: 1
    }
  };

  // Use mock data if no real data is available
  const displayData = hasAuthError ? mockRidesData : (ridesData || mockRidesData);

  console.log('Rides data:', ridesData);
  console.log('Loading:', isLoading);
  console.log('Error:', error);
  console.log('Has auth error:', hasAuthError);
  console.log('Using mock data:', hasAuthError);

  // Client-side filtering
  const filteredRides = useMemo(() => {
    if (!displayData?.data) return [];

    console.log('Raw rides data:', displayData.data);
    let filtered = displayData.data;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(ride => ride.status === filterStatus);
    }

    // Filter by multiple statuses if selected
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(ride => selectedStatuses.includes(ride.status));
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(ride => new Date(ride.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(ride => new Date(ride.createdAt) <= end);
    }

    // Filter by rider name
    if (riderName) {
      const term = riderName.toLowerCase();
      filtered = filtered.filter(ride =>
        ride.rider?.name?.toLowerCase().includes(term)
      );
    }

    // Filter by driver name
    if (driverName) {
      const term = driverName.toLowerCase();
      filtered = filtered.filter(ride =>
        ride.driver?.user?.name?.toLowerCase().includes(term)
      );
    }

    // Filter by search term (general search)
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

    // Sort the filtered rides
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'fare':
          aValue = a.fare?.totalFare || 0;
          bValue = b.fare?.totalFare || 0;
          break;
        case 'distance':
          aValue = a.distance?.actual || 0;
          bValue = b.distance?.actual || 0;
          break;
        case 'riderName':
          aValue = a.rider?.name || '';
          bValue = b.rider?.name || '';
          break;
        case 'driverName':
          aValue = a.driver?.user?.name || '';
          bValue = b.driver?.user?.name || '';
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    console.log('Filtered rides:', filtered);
    return filtered;
  }, [displayData, filterStatus, searchTerm, startDate, endDate, riderName, driverName, selectedStatuses, sortBy, sortOrder]);

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
  const totalPages = displayData?.meta?.totalPages || 1;
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
          {hasAuthError && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">
                🔒 Demo mode: Showing sample data. Please log in as an admin to view real ride data.
              </p>
            </div>
          )}
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
                  <p className="text-3xl font-bold text-gray-900">{displayData?.meta?.total || 0}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* General Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search rides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black"
                />
              </div>

              {/* Rider Name Filter */}
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Filter by rider name"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black"
                />
              </div>

              {/* Driver Name Filter */}
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Filter by driver name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-black"
                />
              </div>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white border-gray-300 text-black">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="fare">Fare</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="riderName">Rider Name</SelectItem>
                  <SelectItem value="driverName">Driver Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white border-gray-300 text-black"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                  <SelectTrigger className="bg-white border-gray-300 text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status (Multiple)</label>
              <div className="flex flex-wrap gap-2">
                {["completed", "cancelled", "in_transit", "picked_up", "accepted", "requested"].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStatuses([...selectedStatuses, status]);
                        } else {
                          setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{status.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setRiderName('');
                  setDriverName('');
                  setStartDate('');
                  setEndDate('');
                  setSelectedStatuses([]);
                  setSortBy('createdAt');
                  setSortOrder('desc');
                  setFilterStatus('all');
                }}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rides Table */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-900">All Rides</CardTitle>
            <CardDescription className="text-gray-600">
              Showing {filteredRides.length} of {displayData?.meta?.total || 0} rides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-700">Ride ID</TableHead>
                    <TableHead className="text-gray-700">Rider</TableHead>
                    <TableHead className="text-gray-700">Driver</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Distance</TableHead>
                    <TableHead className="text-gray-700">Duration</TableHead>
                    <TableHead className="text-gray-700">Fare</TableHead>
                    <TableHead className="text-gray-700">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : filteredRides.length > 0 ? (
                    filteredRides.map((ride: IRide) => {
                      console.log('Rendering ride:', ride._id, ride.rider?.name);
                      return (
                        <TableRow key={ride._id} className="border-gray-200 hover:bg-gray-50">
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              #{ride._id.slice(-6).toUpperCase()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{ride.rider?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{ride.rider?.phone || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{ride.driver?.user?.name || 'No Driver'}</div>
                              <div className="text-sm text-gray-500">{ride.driver?.user?.phone || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(ride.status)} border`}>
                              {ride.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">
                              {ride.distance?.actual ? `${ride.distance.actual.toFixed(1)} km` : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">
                              {ride.duration?.actual ? `${Math.floor(ride.duration.actual / 60)}m ${ride.duration.actual % 60}s` : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              ${ride.fare?.totalFare?.toFixed(2) || '0.00'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">
                              {formatDate(ride.createdAt)}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
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
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

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
            Showing {filteredRides.length} of {displayData?.meta?.total || 0} rides •
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
}