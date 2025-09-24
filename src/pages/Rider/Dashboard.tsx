import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useCancelRideMutation } from "@/redux/features/ride/ride.api";
import { useGetActiveRideQuery } from "@/redux/features/rides/ride.api";
import { Car, Clock, Mail, MapPin, Phone, Shield, Star, User, X } from "lucide-react";

export default function RiderDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: activeRide, isLoading: isLoadingRide } = useGetActiveRideQuery();
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();
  const { toast } = useToast();

  const handleCancelRide = async (rideId: string) => {
    try {
      await cancelRide(rideId).unwrap();
      toast({
        title: "Ride cancelled",
        description: "Your ride request has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Failed to cancel ride",
        description: "Could not cancel your ride. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Mock current location
  const currentLocation = "123 Main Street, New York";
  
  // Mock popular destinations
  const popularDestinations = [
    { id: 1, name: "Central Park", distance: "2.5 miles", eta: "15 min" },
    { id: 2, name: "Grand Central Station", distance: "1.8 miles", eta: "12 min" },
    { id: 3, name: "Times Square", distance: "3.2 miles", eta: "20 min" }
  ];
  
  
  return (
    <div className="container mx-auto py-6 px-4 bg-white min-h-screen">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, <span className="text-primary">{userInfo?.data?.name || 'Rider'}</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Ready for your next journey?
        </p>
      </div>

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
              <div className="font-medium">{currentLocation}</div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2" asChild>
                <a href="/rider/start-ride">
                  <Car className="h-4 w-4" />
                  Start a Ride
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
                  <span className="font-medium">4.9</span>
                  <span className="text-gray-500 text-sm">(32 rides)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span>Rider since Sept 2025</span>
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
                <span className="text-green-600 font-medium">Verified account</span>
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
              <p className="text-gray-500">Loading ride information...</p>
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
                    <div className="text-sm text-gray-500">
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
                      <div className="text-sm text-gray-500">Pickup</div>
                      <div className="font-medium">{activeRide.pickupLocation.address}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Destination</div>
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
                      <span className="text-gray-500">Driver</span>
                      <span className="font-medium">{activeRide.driver.user.name}</span>
                    </div>
                  )}
                  {activeRide.driver && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vehicle</span>
                      <span className="font-medium">
                        {activeRide.driver.vehicle?.make} {activeRide.driver.vehicle?.model}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distance</span>
                    <span className="font-medium">
                      {(activeRide.distance?.estimated || 0).toFixed(1)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fare</span>
                    <span className="font-medium">৳{Math.round(activeRide.fare?.totalFare || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
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

                {activeRide.status === 'requested' && (
                  <div className="mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCancelRide(activeRide._id)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>Cancelling...</>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Cancel Ride
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
      
      {/* Popular Destinations */}
      <Card>
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
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{destination.distance}</span>
                  <span>{destination.eta}</span>
                </div>
                <Button variant="outline" className="w-full mt-3 text-primary">Book Ride</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}