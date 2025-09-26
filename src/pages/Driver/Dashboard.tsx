import ActiveRideManagement from "@/components/modules/Driver/ActiveRideManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetDriverDetailsQuery, useToggleDriverStatusMutation } from "@/redux/features/auth/Driver/driver.api";
import { useAcceptRideMutation, useGetActiveRideQuery, useGetAvailableRidesQuery } from "@/redux/features/rides/ride.api";
import { Car, Check, Clock, DollarSign, Loader2, Mail, MapPin, Phone, Shield, Star, Truck, User, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function DriverDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: availableRides, isLoading: isLoadingRides } = useGetAvailableRidesQuery();
  const { data: driverDetails, isLoading: isLoadingDriverDetails } = useGetDriverDetailsQuery();
  const { data: activeRide, isLoading: isLoadingActiveRide } = useGetActiveRideQuery();
  const [toggleDriverStatus, { isLoading: isTogglingStatus }] = useToggleDriverStatusMutation();
  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();
  const { toast } = useToast();

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide({ id: rideId }).unwrap();
      toast({
        title: "Ride accepted!",
        description: "You have successfully accepted this ride.",
      });
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast({
        title: "Failed to accept ride",
        description: "Could not accept this ride. It may have been taken by another driver.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRide = async (rideId: string) => {
    // For now, just show a toast. In a real app, this might call an API to reject the ride
    toast({
      title: "Ride rejected",
      description: "You have rejected this ride request.",
      variant: "default",
    });
    // Optionally, you could refetch available rides to remove the rejected one
    // But since it's not persisted server-side for rejection, we'll just notify
  };

  const handleToggleStatus = async () => {
    try {
      const result = await toggleDriverStatus().unwrap();
      toast({
        title: result.success ? "Status updated" : "Failed to update status",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error toggling driver status:', error);
      toast({
        title: "Failed to update status",
        description: "Could not update your availability status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Use real data if available, otherwise fallback to mock data
  const driverStats = {
    totalRides: 128,
    completedToday: 5,
    totalEarnings: driverDetails?.earnings?.totalEarnings || 3450.75,
    rating: driverDetails?.rating?.average || 4.8,
    vehicleInfo: driverDetails?.vehicleType || {
      make: "Toyota",
      model: "Camry",
      year: "2021",
      licensePlate: "ABC-1234",
      status: "active"
    },
    availability: driverDetails?.availability || 'offline'
  };
  
  
  return (
    <div className="container mx-auto py-6 bg-white min-h-screen">
      {/* Driver Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle>Driver Statistics</CardTitle>
            <CardDescription>Your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Total Rides</span>
                </div>
                <p className="text-2xl font-bold">{driverStats.totalRides}</p>
              </div>
              
              <div className="bg-green-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold">{driverStats.completedToday}</p>
              </div>

              <div className="bg-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Earnings</span>
                </div>
                <p className="text-2xl font-bold">${driverStats.totalEarnings.toFixed(2)}</p>
              </div>

              <div className="bg-yellow-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium">Rating</span>
                </div>
                <p className="text-2xl font-bold">{driverStats.rating}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className={`flex items-center gap-2 ${driverStats.availability === 'online' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isTogglingStatus ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : driverStats.availability === 'online' ? (
                  <>
                    <Car className="h-4 w-4" />
                    Go Offline
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4" />
                    Go Online
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Set Destination
              </Button>
              <Button asChild variant="secondary" className="flex items-center gap-2">
                <Link to="/driver/wallet">
                  <DollarSign className="h-4 w-4" />
                  Wallet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-full bg-gray-100">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{driverStats.vehicleInfo.make} {driverStats.vehicleInfo.model}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">{driverStats.vehicleInfo.year}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                    {driverStats.vehicleInfo.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 mb-4">
              <div className="font-medium mb-2">License Plate</div>
              <div className="text-xl font-mono tracking-wider text-center py-1 px-3 border-2 border-dashed border-gray-300 rounded">
                {driverStats.vehicleInfo.licensePlate}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <span>Driver since July 2025</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.email || 'driver@example.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{userInfo?.data?.phone || '+1 (555) 987-6543'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">Verified driver</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">$1,245.50</div>
            <div className="text-primary-foreground/80 mb-4">Available for withdrawal</div>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm" className="text-primary">
                Add Funds
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white/20">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/80 to-blue-600 text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Today's Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">$87.50</div>
            <div className="text-blue-100 mb-4">From 5 completed rides</div>
            <Button variant="secondary" size="sm" className="text-blue-600">
              View Details
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/80 to-green-600 text-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">$350/$500</div>
            <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
              <div className="bg-white h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="text-green-100">70% of weekly goal achieved</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Ride Management */}
      <ActiveRideManagement ride={activeRide} />
      
      {/* Available Rides */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Available Rides</CardTitle>
          <CardDescription>Rides waiting for drivers to accept</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRides ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Loading available rides...</p>
            </div>
          ) : availableRides && availableRides.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {availableRides.map((ride) => (
                <div key={ride._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                    <div className="md:w-1/4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">
                          {new Date(ride.timestamps.requested).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        ID: {ride._id.slice(-6)}
                      </div>
                    </div>

                    <div className="md:w-1/2">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full p-1.5 bg-green-100">
                            <MapPin className="h-3 w-3 text-green-600" />
                          </div>
                          <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                          <div className="rounded-full p-1.5 bg-red-100">
                            <MapPin className="h-3 w-3 text-red-500" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <div className="text-sm text-gray-500">Pickup</div>
                            <div className="font-medium">{ride.pickupLocation.address}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Destination</div>
                            <div className="font-medium">{ride.destinationLocation.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/4">
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="font-medium">{ride.rider.name}</div>
                          <div className="text-sm text-gray-500">
                            {(ride.distance?.estimated || 0).toFixed(1)} km
                          </div>
                          <div className="text-lg font-bold text-primary">
                            ৳{Math.round(ride.fare?.totalFare || 0)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleRejectRide(ride._id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptRide(ride._id)}
                            disabled={isAccepting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isAccepting ? (
                              <>Accepting...</>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No available rides at the moment</p>
              <Button variant="outline" className="mt-4">
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}