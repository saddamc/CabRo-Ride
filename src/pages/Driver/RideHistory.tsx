import RatingModalDriver from "@/components/modal/ratingModalDriver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMyRidesQuery, type IRide } from "@/redux/features/ride-api";
import {
  Calendar,
  Car,
  Clock,
  FileClock,
  MapPin,
  Route,
  Star,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function DriverRideHistory() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minFare, setMinFare] = useState("");
  const [maxFare, setMaxFare] = useState("");
  const [ratingModal, setRatingModal] = useState({
    open: false,
    rideId: "",
    riderName: "",
  });
  const itemsPerPage = 10;

  // Use real API data with pagination
  const { data: rideHistoryData, isLoading } = useGetMyRidesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Get all rides from the response
  const rideHistory: IRide[] = rideHistoryData?.rides || [];

  // Filter rides based on all filters
  const filteredRides: IRide[] = useMemo(() => {
    let filtered = rideHistory;

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((ride) => ride.status === filterStatus);
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(
        (ride) => new Date(ride.createdAt) >= fromDate
      );
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter((ride) => new Date(ride.createdAt) <= toDate);
    }

    // Fare range filter
    if (minFare) {
      const min = parseFloat(minFare);
      filtered = filtered.filter((ride) => ride.fare?.totalFare >= min);
    }
    if (maxFare) {
      const max = parseFloat(maxFare);
      filtered = filtered.filter((ride) => ride.fare?.totalFare <= max);
    }

    return filtered;
  }, [rideHistory, filterStatus, dateFrom, dateTo, minFare, maxFare]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-black dark:bg-green-900/30 dark:text-black hover:bg-green-100">
            {status}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="text-black border-red-200 dark:border-red-800"
          >
            {status}
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-black dark:bg-blue-900/30 dark:text-black hover:bg-blue-100">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <div className="h-12 w-12 border-b-2 border-primary mx-auto mb-4 animate-spin rounded-full"></div>
          <p>Loading ride history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white rounded-2xl text-black">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-black dark:text-black mt-2">
          View details of all your past rides
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ride Statistics</CardTitle>
          <CardDescription>Your driving activity summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-black" />
                <span className="text-sm font-medium">Total Rides</span>
              </div>
              <p className="text-2xl font-bold">
                {
                  rideHistory.filter((ride) => ride.status === "completed")
                    .length
                }
              </p>
            </div>

            <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Route className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Total Distance</span>
              </div>
              <p className="text-2xl font-bold">
                {rideHistory
                  .filter((ride) => ride.status === "completed")
                  .reduce((acc, ride) => acc + (ride.distance?.actual || 0), 0)
                  .toFixed(1)}{" "}
                km
              </p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Driving Time</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.floor(
                  rideHistory
                    .filter((ride) => ride.status === "completed")
                    .reduce(
                      (acc, ride) => acc + (ride.duration?.actual || 0),
                      0
                    ) / 60
                )}{" "}
                hrs
              </p>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileClock className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Cancellations</span>
              </div>
              <p className="text-2xl font-bold">
                {
                  rideHistory.filter((ride) => ride.status === "cancelled")
                    .length
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rides</CardTitle>
          <CardDescription>
            Filter and view your past ride records
          </CardDescription>
        </CardHeader>

        {/* Advanced Filters */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rides</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="minFare">Min Fare (৳)</Label>
              <Input
                id="minFare"
                type="number"
                placeholder="0"
                value={minFare}
                onChange={(e) => setMinFare(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFare">Max Fare (৳)</Label>
              <Input
                id="maxFare"
                type="number"
                placeholder="1000"
                value={maxFare}
                onChange={(e) => setMaxFare(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterStatus("all");
                  setDateFrom("");
                  setDateTo("");
                  setMinFare("");
                  setMaxFare("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="pt-6">
          {filteredRides.length > 0 ? (
            <div className="space-y-6">
              {filteredRides.map((ride) => (
                <Card
                  key={ride._id}
                  className={`${
                    ride.status === "completed"
                      ? "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                      : ride.status === "cancelled"
                      ? "border-red-200 bg-red-50/50 dark:bg-red-900/10"
                      : ride.status === "in-progress"
                      ? "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10"
                      : "border-gray-200 dark:border-gray-800"
                  } shadow-sm hover:shadow-md transition-shadow`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-mono text-gray-500">
                        #{ride._id.slice(-6)}
                      </div>
                      {getStatusBadge(ride.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left Section - Date, Rider, Status */}
                      <div className="lg:w-1/4">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900">
                            {formatDate(ride.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">
                            {ride.rider.name}
                          </span>
                        </div>
                      </div>

                      {/* Middle Section - Route */}
                      <div className="lg:w-2/4">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full p-2 bg-green-100">
                              <MapPin className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                            <div className="rounded-full p-2 bg-red-100">
                              <MapPin className="h-3 w-3 text-red-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="mb-3">
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Pickup
                              </div>
                              <div className="font-medium text-gray-900">
                                {ride.pickupLocation.address}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                Destination
                              </div>
                              <div className="font-medium text-gray-900">
                                {ride.destinationLocation.address}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Stats */}
                      <div className="lg:w-1/4">
                        <div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">
                              Distance
                            </span>
                            <span className="font-semibold text-gray-900">
                              {ride.distance?.actual?.toFixed(1)} km
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">
                              Duration
                            </span>
                            <span className="font-semibold text-gray-900">
                              {ride.duration?.actual
                                ? `${Math.round(ride.duration.actual)} min`
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-600">
                              Earnings
                            </span>
                            <span className="font-semibold text-green-600">
                              ৳{ride.fare?.totalFare?.toFixed(2)}
                            </span>
                          </div>
                          {/* Rating Display */}
                          {ride.rating?.riderRating && (
                            <div className="flex justify-between gap-2 bg-yellow-50 px-4 py-2 rounded-md">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-5 w-5 ${
                                      star <= (ride.rating?.riderRating || 0)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>

                              {/* Rating Action */}
                              <div>
                                {ride.status === "completed" && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      setRatingModal({
                                        open: true,
                                        rideId: ride._id,
                                        riderName: ride.rider.name,
                                      })
                                    }
                                    className={`flex items-center gap-1 ${
                                      ride.rating?.riderRating
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-orange-600 hover:bg-orange-700"
                                    }`}
                                  >
                                    <Star className="h-3 w-3" />
                                    {ride.rating?.riderRating
                                      ? "Edit"
                                      : "Rate Rider"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Priority Message for Recent Unrated Rides */}
                          {ride.status === "completed" &&
                            !ride.rating?.riderRating && (
                              <div className="text-xs bg-orange-100 px-2 py-1 rounded-md text-center">
                                ⭐ Please rate your rider to help improve
                                service!
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-black dark:text-black mb-4">
                No rides found matching your filter
              </p>
              <Button variant="outline" onClick={() => setFilterStatus("all")}>
                Show All Rides
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-600">
            Page {currentPage} of{" "}
            {Math.ceil((rideHistoryData?.total || 0) / itemsPerPage)} (
            {rideHistoryData?.total || 0} total rides)
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  Math.ceil((rideHistoryData?.total || 0) / itemsPerPage),
                  prev + 1
                )
              )
            }
            disabled={
              currentPage >=
              Math.ceil((rideHistoryData?.total || 0) / itemsPerPage)
            }
          >
            Next
          </Button>
        </CardFooter>
      </Card>

      {/* {filterStatus === "all" && (
        <Alert className="mt-6">
          <FileClock className="h-4 w-4" />
          <AlertTitle>Ride History Export</AlertTitle>
          <AlertDescription>
            You can download your complete ride history for tax purposes or record keeping.
            <Button variant="link" className="p-0 h-auto font-normal" size="sm">
              Export as CSV
            </Button>
          </AlertDescription>
        </Alert>
      )} */}

      {/* Rating Modal */}
      <RatingModalDriver
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ ...ratingModal, open: false })}
        rideId={ratingModal.rideId}
        riderName={ratingModal.riderName}
        onRatingComplete={() => {
          setRatingModal({ ...ratingModal, open: false });
          // Refetch data after rating
          window.location.reload();
        }}
      />
    </div>
  );
}
