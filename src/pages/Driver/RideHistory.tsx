import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RatingModal from "@/components/ui/RatingModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetMyRidesQuery, type IRide } from "@/redux/features/ride-api";
import { Calendar, Car, Clock, FileClock, MapPin, Route, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverRideHistory() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [ratingModal, setRatingModal] = useState<{ open: boolean; rideId: string | null; targetName: string }>({ open: false, rideId: null, targetName: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // Use real API data
  const { data: rideHistoryData, isLoading } = useGetMyRidesQuery({ limit: 100, refreshKey });

  // Get all rides from the response
  const rideHistory: IRide[] = rideHistoryData?.rides || [];

  // Filter rides based on status
  const filteredRides: IRide[] = filterStatus === "all"
    ? rideHistory
    : rideHistory.filter(ride => ride.status === filterStatus);

  // Format date function
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

  // Get badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-black dark:bg-green-900/30 dark:text-black hover:bg-green-100">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-black border-red-200 dark:border-red-800">{status}</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-black dark:bg-blue-900/30 dark:text-black hover:bg-blue-100">{status}</Badge>;
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
              <p className="text-2xl font-bold">{rideHistory.filter(ride => ride.status === "completed").length}</p>
            </div>

            <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Route className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Total Distance</span>
              </div>
              <p className="text-2xl font-bold">
                {rideHistory
                  .filter(ride => ride.status === "completed")
                  .reduce((acc, ride) => acc + (ride.distance?.actual || 0), 0)
                  .toFixed(1)} km
              </p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Driving Time</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.floor(rideHistory
                  .filter(ride => ride.status === "completed")
                  .reduce((acc, ride) => acc + (ride.duration?.actual || 0), 0) / 60)} hrs
              </p>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileClock className="h-5 w-5 text-black dark:text-black" />
                <span className="text-sm font-medium">Cancellations</span>
              </div>
              <p className="text-2xl font-bold">{rideHistory.filter(ride => ride.status === "cancelled").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Your Rides</CardTitle>
          <div className="flex items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rides</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {filteredRides.length > 0 ? (
            <div className="space-y-6">
              {filteredRides.map((ride) => (
                <div
                  key={ride._id}
                  className={`border border-gray-200 dark:border-gray-800 rounded-xl p-4 ${
                    ride.status === 'completed' ? 'bg-green-50 dark:bg-green-900/10' :
                    ride.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/10' :
                    ride.status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/10' :
                    'bg-white dark:bg-neutral-900'
                  }`}
                >
                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="w-full md:w-1/4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-black" />
                        <span className="font-medium">{formatDate(ride.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-black" />
                        <span>{ride.rider.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ride.status)}
                        <span className="text-sm text-black">{ride._id.slice(-8)}</span>
                      </div>
                    </div>

                    <div className="w-full md:w-2/4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full p-1.5 bg-primary/10">
                            <MapPin className="h-3 w-3 text-black" />
                          </div>
                          <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 my-1"></div>
                          <div className="rounded-full p-1.5 bg-red-100 dark:bg-red-900/20">
                            <MapPin className="h-3 w-3 text-black dark:text-black" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <div className="text-sm text-black">Pickup</div>
                            <div className="font-medium">{ride.pickupLocation.address}</div>
                          </div>
                          <div>
                            <div className="text-sm text-black">Destination</div>
                            <div className="font-medium">{ride.destinationLocation.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-black">Distance</span>
                          <span className="font-medium">{ride.distance?.actual?.toFixed(1)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Duration</span>
                          <span className="font-medium">{ride.duration?.actual ? `${Math.round(ride.duration.actual)} min` : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black">Earnings</span>
                          <span className="font-medium text-black">৳{ride.fare?.totalFare?.toFixed(2)}</span>
                        </div>
                        {ride.status === "completed" && ride.rating?.riderRating && (
                          <div className="flex justify-between items-center">
                            <span className="text-black">Rider Rating</span>
                            <button
                              className="flex items-center group cursor-pointer"
                              title="Click to rate again or leave a comment"
                              onClick={() => setRatingModal({ open: true, rideId: ride._id, targetName: ride.rider.name })}
                            >
                              {Array(5).fill(0).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 transition-colors ${i < (ride.rating?.riderRating || 0) ? 'text-black fill-current' : 'text-black dark:text-black group-hover:text-black'}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/driver/ride-details/${ride._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-black dark:text-black mb-4">No rides found matching your filter</p>
              <Button variant="outline" onClick={() => setFilterStatus("all")}>
                Show All Rides
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <div className="text-sm text-black">
            Showing {filteredRides.length} of {rideHistory.length} rides
          </div>
          <Button variant="outline" disabled>
            Next
          </Button>
        </CardFooter>
      </Card>

      {filterStatus === "all" && (
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
      )}
      {/* Rating Modal for re-rating or leaving a comment */}
      <RatingModal
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ open: false, rideId: null, targetName: "" })}
        rideId={ratingModal.rideId || ""}
        rideStatus="completed"
        userRole="driver"
        targetName={ratingModal.targetName}
        onRatingComplete={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}