import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RatingModal from "@/components/ui/RatingModal";
import { useGetMyRidesQuery } from "@/redux/features/rides/ride.api";
import { AlertCircle, Calendar, Clock, MapPin, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RideHistory() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 5;

  const [ratingModal, setRatingModal] = useState<{
    open: boolean;
    rideId: string | null;
    driverName: string;
    currentRating: number;
    rideStatus: string;
  }>({ open: false, rideId: null, driverName: '', currentRating: 0, rideStatus: '' });

  // Get all rides for display and stats calculation
  const { data: allRidesData, refetch } = useGetMyRidesQuery({});

  // Reset to page 1 when component mounts
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  // Auto-refetch every 30 seconds for real-time updates
  const refetchInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    refetch(); // Initial fetch
    if (refetchInterval.current) clearInterval(refetchInterval.current);
    refetchInterval.current = setInterval(() => {
      refetch();
    }, 30000); // 30 seconds
    return () => {
      if (refetchInterval.current) clearInterval(refetchInterval.current);
    };
  }, [refetch]);

  const allRides = allRidesData?.rides || [];

  // Calculate stats from all rides data
  const totalRides = allRides.length;
  const totalSpent = allRides.reduce((sum, ride) => sum + (ride.fare?.totalFare || 0), 0);
  const totalDistance = allRides.reduce((sum, ride) => sum + (ride.distance?.estimated || 0), 0);

  // Sort rides by creation date (newest first) - create a copy to avoid mutating read-only array
  const sortedRides = [...allRides].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination info
  const totalPages = Math.ceil(sortedRides.length / ridesPerPage);

  // Get rides for current page
  const startIndex = (currentPage - 1) * ridesPerPage;
  const endIndex = startIndex + ridesPerPage;
  const rides = sortedRides.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto rounded-2xl py-8 px-4 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-muted-foreground mt-2">
          View your past rides and receipts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Rides */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRides}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        {/* Total Distance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        {/* Total Spent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <h1 className="font-bold text-xl">৳</h1>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rides.length > 0 ? rides.map((ride) => {
              const isCompletedRecently = ride.status === 'completed' &&
                new Date(ride.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours
              const needsRating = ride.status === 'completed' && !ride.rating?.riderRating;
              const hasRating = ride.rating?.riderRating;

              return (
                <Card key={ride._id} className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                  needsRating ? 'ring-2 ring-orange-200 bg-orange-50/50' : ''
                }`}>
                  {/* Rating Priority Indicator */}
                  {needsRating && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-orange-100 border-orange-300">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Needs Rating
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section - Ride Info */}
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {new Date(ride.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(ride.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="text-xs text-muted-foreground font-mono">
                                #{ride._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${
                            ride.status === 'completed' ? 'bg-green-100' :
                            ride.status === 'cancelled' ? 'bg-red-100' :
                            'bg-yellow-100'
                          }`}>
                            {ride.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        {/* Route */}
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className="rounded-full p-1.5 bg-green-100">
                              <MapPin className="h-3 w-3" />
                            </div>
                            <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
                            <div className="rounded-full p-1.5 bg-red-100">
                              <MapPin className="h-3 w-3" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div>
                              <span className="text-xs text-muted-foreground block">From</span>
                              <span className="text-sm font-medium truncate block">
                                {ride.pickupLocation?.address || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground block">To</span>
                              <span className="text-sm font-medium truncate block">
                                {ride.destinationLocation?.address || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Driver & Vehicle Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground block">Driver</span>
                            <span className="font-medium">{ride.driver?.user?.name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">Vehicle</span>
                            <span className="font-medium text-xs">
                              {ride.driver?.vehicle?.make} {ride.driver?.vehicle?.model}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Actions & Fare */}
                      <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                        {/* Fare */}
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ৳{ride.fare?.totalFare?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {ride.distance?.estimated?.toFixed(1)} km
                          </div>
                        </div>

                        
                        <div className="flex justify-between">
                                   {/* Action Buttons */}
                        <div >
                          {ride.status === 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => setRatingModal({
                                open: true,
                                rideId: ride._id,
                                driverName: ride.driver?.user?.name || 'Driver',
                                currentRating: ride.rating?.riderRating || 0,
                                rideStatus: ride.status
                              })}
                              className={`flex items-center gap-1 ${
                                needsRating
                                  ? 'bg-orange-600 hover:bg-orange-700'
                                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                            >
                              <Star className="h-3 w-3" />
                              {hasRating ? 'Edit' : 'Rate Driver'}
                            </Button>
                          )}
                        </div>
                        {/* Rating Display */}
                        {hasRating && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= (ride.rating?.riderRating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                       

                        {/* Priority Message for Recent Unrated Rides */}
                        {needsRating && isCompletedRecently && (
                          <div className="text-xs bg-orange-100 px-2 py-1 rounded-md text-center">
                            ⭐ Please rate your driver to help improve service!
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 inline-block rounded-full mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">No rides yet</h3>
                <p className="text-muted-foreground">Your ride history will appear here once you complete your first ride.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage && page === currentPage - 2) {
                      return <span key={page} className="px-2">...</span>;
                    }

                    if (!showPage && page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10"
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
          {/* Rating Modal (global, outside map loop) */}
          <RatingModal
            isOpen={ratingModal.open}
            onClose={() => setRatingModal({ ...ratingModal, open: false })}
            rideId={ratingModal.rideId || ''}
            rideStatus={ratingModal.rideStatus}
            userRole="rider"
            targetName={ratingModal.driverName}
            onRatingComplete={() => {
              setRatingModal({ ...ratingModal, open: false });
              refetch();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}