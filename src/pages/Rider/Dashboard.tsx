/* eslint-disable @typescript-eslint/no-explicit-any */
import RidesSummary from "@/components/layout/function/RidesSummary";
import CancelRide from "@/components/RideBooking/CancelRide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetActiveRideQuery, useGetCurrentLocationQuery, useGetRideHistoryQuery } from "@/redux/features/rides/ride.api";
import { Calendar, Car, Clock, Mail, MapPin, Phone, Shield, Star, User } from "lucide-react";
import { useEffect, useRef } from "react";


const RiderDashboard = () => {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: activeRide, isLoading: isLoadingRide } = useGetActiveRideQuery();
  const { data: currentLocation, isLoading: isLoadingLocation } = useGetCurrentLocationQuery();
  const { data: rideHistory, refetch: refetchHistory } = useGetRideHistoryQuery({ limit: 100 });

  const allRides = rideHistory?.rides || [];

  // Example: calculate stats locally
  const completedRides = allRides.filter((ride) => ride.status === "completed");
  const totalRides = allRides.length;
  const averageRating =
    completedRides.reduce((sum, r) => sum + (r.rating?.riderRating || 0), 0) /
    (completedRides.length || 1);

  // Auto-refetch ride history on mount and every 30 seconds
  const refetchInterval = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    refetchHistory(); // Initial fetch
    if (refetchInterval.current) clearInterval(refetchInterval.current);
    refetchInterval.current = setInterval(() => {
      refetchHistory();
    }, 30000); // 30 seconds
    return () => {
      if (refetchInterval.current) clearInterval(refetchInterval.current);
    };
  }, [refetchHistory]);

  

  // Get recent rides (last 3)
  const recentRides = [...(rideHistory?.rides || [])]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div className="container mx-auto py-6 px-4 text-black bg-white min-h-screen">

      {/* Rider Stats */}
      <RidesSummary />

      {/* Current Location and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
            <CardDescription>Book a ride from your current location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="font-medium">
                {isLoadingLocation ? "Getting your location..." : (currentLocation?.address || "Location not available")}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2" asChild>
                <a href="/ride">
                  <Car className="h-4 w-4" />
                  Book a Ride
                </a>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule Ride
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={
                  userInfo?.data?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.data?.name || 'User')}&background=10b981&color=fff&size=96`
                }
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div>
                <h3 className="font-semibold text-lg">{userInfo?.data?.name || 'User'}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-medium">{averageRating.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-500 text-sm">({totalRides} rides)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span>Rider since {userInfo?.data?.createdAt ? new Date(userInfo.data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.email || 'user@example.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.phone || '+1 (555) 123-4567'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className={`font-medium ${userInfo?.data?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {userInfo?.data?.isVerified ? 'Verified account' : 'Unverified account'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active/Pending Ride */}
      {isLoadingRide ? (
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="text-center">
              <p>Loading ride information...</p>
            </div>
          </CardContent>
        </Card>
      ) : activeRide ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {activeRide.status === 'requested' ? 'Pending Ride' : 'Active Ride'}
            </CardTitle>
            <CardDescription>
              {activeRide.status === 'requested'
                ? 'Waiting for a driver to accept your ride request'
                : 'Your ride is currently active'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap md:flex-nowrap items-start gap-6">
              <div className="w-full md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {new Date(activeRide.timestamps.requested).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(activeRide.timestamps.requested).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-green-100">
                      <MapPin className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                    <div className="rounded-full p-2 bg-red-100">
                      <MapPin className="h-4 w-4 text-red-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">Pickup</div>
                      <div className="font-medium">{activeRide.pickupLocation.address}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Destination</div>
                      <div className="font-medium">{activeRide.destinationLocation.address}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                <h4 className="font-medium mb-3">Ride Details</h4>
                <div className="space-y-2">
                  {activeRide.driver && (
                    <div className="flex justify-between">
                      <span>Driver</span>
                      <span className="font-medium">{activeRide.driver?.name || 'Unknown'}</span>
                    </div>
                  )}
                  {activeRide.driver && (
                    <div className="flex justify-between">
                      <span>Vehicle</span>
                      <span className="font-medium">
                        {activeRide.driver.vehicleType?.make || 'Unknown'} {activeRide.driver.vehicleType?.model || 'Vehicle'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Distance</span>
                    <span className="font-medium">
                      {(activeRide.distance?.estimated || 0).toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fare</span>
                    <span className="font-medium">৳{Math.round(activeRide.fare?.totalFare || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className={`font-medium capitalize ${
                      activeRide.status === 'requested' ? 'text-yellow-600' :
                      activeRide.status === 'accepted' ? 'text-blue-600' :
                      activeRide.status === 'in_transit' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {activeRide.status === 'requested' ? 'Finding Driver' :
                       activeRide.status === 'accepted' ? 'Driver Assigned' :
                       activeRide.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {(activeRide.status === 'requested' || activeRide.status === 'pending' || activeRide.status === 'accepted' || activeRide.status === 'in_transit') && (
                  <div className="mt-4">
                    <CancelRide
                      rideId={activeRide._id}
                      currentStatus={activeRide.status}
                      onCancelSuccess={() => window.location.reload()}
                      trigger={
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                        >
                          Cancel Ride
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {/* Recent Rides */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Rides</CardTitle>
            <CardDescription>Your recent ride history</CardDescription>
          </div>
          {/* apply Now Button */}
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDriverModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Apply Now
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRides.length > 0 ? recentRides.map((ride: any) => (
              <Card key={ride._id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left Section - Ride Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {new Date(ride.createdAt).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(ride.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                          ride.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {ride.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      {/* Route */}
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full p-1.5 bg-green-100">
                            <MapPin className="h-3 w-3 text-green-600" />
                          </div>
                          <div className="w-0.5 h-6 bg-gray-300 my-1"></div>
                          <div className="rounded-full p-1.5 bg-red-100">
                            <MapPin className="h-3 w-3 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div>
                            <span className="text-xs text-gray-500 block">From</span>
                            <span className="text-sm font-medium truncate block">
                              {ride.pickupLocation?.address || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">To</span>
                            <span className="text-sm font-medium truncate block">
                              {ride.destinationLocation?.address || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Price & Actions */}
                    <div className="flex flex-col items-end gap-3 lg:min-w-[150px]">
                      {/* Fare */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ৳{ride.fare?.totalFare?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {ride.distance?.estimated?.toFixed(1)} km
                        </div>
                      </div>

                      {/* Action Button - Apply for Driver */}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDriverModalOpen(true)}
                        className="flex items-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" />
                        Apply Driver
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-6">
                <div className="p-3 bg-gray-100 inline-block rounded-full mb-3">
                  <Car className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500">No rides yet. Book your first ride now!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Popular Destinations</CardTitle>
          <CardDescription>Quick access to frequently visited places</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularDestinations.map(destination => (
              <div
                key={destination.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <h3 className="font-medium mb-2">{destination.name}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{destination.distance}</span>
                  <span>{destination.eta}</span>
                </div>
                <Button variant="outline" className="w-full mt-3 text-primary">Book Ride</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* Driver Application Modal */}
      {/* <DriverApplicationModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
      /> */}
      {/* <RideHistory rides= */}
    </div>
  );
}


export default RiderDashboard;