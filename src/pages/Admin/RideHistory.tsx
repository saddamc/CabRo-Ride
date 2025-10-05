import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllRideQuery } from "@/redux/features/ride-api";
import { Car, Clock, DollarSign, Navigation, Search, Table, UserIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Define a type for the ride objects to avoid using 'any'
interface IRideDisplay {
  _id: string;
  status: string;
  rider?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  driver?: {
    name?: string;
    phone?: string;
    user?: {
      name?: string;
      phone?: string;
    };
  };
  pickupLocation?: {
    address?: string;
  };
  destinationLocation?: {
    address?: string;
  };
  fare?: {
    totalFare?: number;
  };
  distance?: {
    actual?: number;
  };
  duration?: {
    actual?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export default function AdminRideHistory() {
  // No need for currentPage state as we're showing all data at once
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [riderName, setRiderName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: ridesData, isLoading, error, refetch } = useGetAllRideQuery({
    page: 1,
    limit: 999 // Using a high limit to fetch all rides at once
  }, {
    refetchOnMountOrArgChange: true
  });

  // Format data to match expected structure
  // The API is returning an array directly instead of {data: [...], meta: {...}}
  const displayData = useMemo(() => {
    if (!ridesData) return { data: [], meta: { total: 0, page: 1, limit: 999, totalPages: 1 } };
    
    // If ridesData is an array, wrap it in the expected structure
    if (Array.isArray(ridesData)) {
      console.log("Wrapping array data in expected structure");
      return {
        data: ridesData,
        meta: {
          total: ridesData.length,
          page: 1,
          limit: 999,
          totalPages: 1
        }
      };
    }
    
    // If ridesData already has data and meta
    if (ridesData.data && ridesData.meta) {
      console.log("Using existing data structure");
      return ridesData;
    }
    
    // Fallback - create empty structure
    console.log("Fallback - creating empty structure");
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 999, totalPages: 1 }
    };
  }, [ridesData]);
  
  // Refetch data when component mounts
  useEffect(() => {
    console.log("Refetching all ride data");
    refetch()
      .then(result => {
        console.log("Refetch success:", result);
      })
      .catch(err => {
        console.error("Refetch error:", err);
      });
  }, [refetch]);

  console.log('Raw API response:', ridesData);
  console.log('Display data structure:', displayData);
  console.log('Display data.data:', displayData?.data);
  console.log('Display data.meta:', displayData?.meta);

  // Client-side filtering
  const filteredRides = useMemo(() => {
    if (!displayData?.data) {
      console.log("No data available to filter");
      return [];
    }

    // Create a mutable copy of the array to avoid issues with frozen objects
    let filtered: IRideDisplay[] = Array.isArray(displayData.data) ? [...displayData.data] : [];

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
        ride.driver?.user?.name?.toLowerCase().includes(term) ||
        ride.driver?.name?.toLowerCase().includes(term)
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

    // Sort the filtered rides - using a new sorted array instead of in-place sort
    const sortedRides = [...filtered].sort((a: IRideDisplay, b: IRideDisplay) => {
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
          aValue = a.driver?.user?.name || a.driver?.name || '';
          bValue = b.driver?.user?.name || b.driver?.name || '';
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

    console.log('Filtered rides:', sortedRides);
    return sortedRides;
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
// Log display data for debugging purposes
console.log("displayData:", displayData);
console.log("isLoading:", isLoading);
console.log("error:", error);
console.log("filteredRides length:", filteredRides.length);
console.log("First ride sample:", filteredRides[0]);

  // No pagination needed as we're showing all data

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
                  <p className="text-3xl font-bold text-gray-900">{displayData?.data?.length || displayData?.meta?.total || 0}</p>
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
              Showing all {filteredRides.length} rides
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
                  {(() => {
                    console.log('Table render:', { isLoading, error: !!error, filteredRidesLength: filteredRides.length });
                    return null;
                  })()}
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
                  ) : Array.isArray(ridesData) && ridesData.length > 0 && filteredRides.length === 0 ? (
                    // If we have raw data but filteredRides is empty, something's wrong with the filtering
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Car className="h-12 w-12 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Format Issue</h3>
                        <p className="text-gray-600 mb-6">
                          We received {ridesData.length} rides from the server but couldn't display them properly.
                        </p>
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Reload Page
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : filteredRides.length > 0 ? (
                    filteredRides.map((ride: IRideDisplay) => (
                      <TableRow key={ride._id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            #{ride._id?.slice(-6).toUpperCase() || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ride.rider?.name || ride.rider?.email || 'Unknown Rider'}</div>
                            <div className="text-sm text-gray-500">{ride.rider?.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ride.driver?.user?.name || ride.driver?.name || 'No Driver'}</div>
                            <div className="text-sm text-gray-500">{ride.driver?.user?.phone || ride.driver?.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(ride.status)} border`}>
                            {ride.status?.replace('_', ' ') || 'Unknown'}
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
                            {ride.createdAt ? formatDate(ride.createdAt) : 'N/A'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : Array.isArray(ridesData) && filteredRides.length === 0 ? (
                    // Direct fallback rendering of array data if filtering failed
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ridesData.map((ride: any) => (
                      <TableRow key={ride._id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-gray-900">
                            #{ride._id?.slice(-6).toUpperCase() || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ride.rider?.name || ride.rider?.email || 'Unknown Rider'}</div>
                            <div className="text-sm text-gray-500">{ride.rider?.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{ride.driver?.user?.name || ride.driver?.name || 'No Driver'}</div>
                            <div className="text-sm text-gray-500">{ride.driver?.user?.phone || ride.driver?.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(ride.status)} border`}>
                            {ride.status?.replace('_', ' ') || 'Unknown'}
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
                            {ride.createdAt ? formatDate(ride.createdAt) : 'N/A'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                          <Car className="h-12 w-12 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                        <p className="text-gray-600 mb-6">
                          {error.status === 401 || error.status === 403 ? 
                            "You need admin privileges to view ride data. Please log in as an administrator." :
                            `There was a problem loading the ride data: ${error.status ? `Error ${error.status}` : "Connection failed"}. Please try again.`}
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button
                            onClick={() => window.location.href = '/login'}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Go to Login
                          </Button>
                          <Button
                            onClick={() => refetch()}
                            variant="outline"
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Try Again
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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

        {/* Pagination removed as we're showing all data */}

        {/* Footer Stats */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Displaying all {filteredRides.length} rides
          </p>
        </div>
      </div>
    </div>
  );
}