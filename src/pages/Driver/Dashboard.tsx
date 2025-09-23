import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Car, Clock, DollarSign, Mail, MapPin, Phone, Shield, Star, Truck, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function DriverDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  
  // Mock data for driver dashboard
  const driverStats = {
    totalRides: 128,
    completedToday: 5,
    totalEarnings: 3450.75,
    rating: 4.8,
    vehicleInfo: {
      make: "Toyota",
      model: "Camry",
      year: "2021",
      licensePlate: "ABC-1234",
      status: "active"
    }
  };
  
  // Mock upcoming rides
  const upcomingRides = [
    {
      id: "RID-67890",
      time: "10:15 AM",
      pickup: "Downtown Plaza",
      destination: "Shopping Mall",
      rider: "Sarah Johnson",
      fare: 18.50,
      distance: "3.2 miles"
    },
    {
      id: "RID-67891",
      time: "11:45 AM",
      pickup: "Central Station",
      destination: "Business Park",
      rider: "John Smith",
      fare: 22.75,
      distance: "4.5 miles"
    }
  ];
  
  return (
    <div className="container mx-auto py-4 bg-white dark:bg-gray-950">
      {/* Driver Stats and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
              
              <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold">{driverStats.completedToday}</p>
              </div>
              
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">Earnings</span>
                </div>
                <p className="text-2xl font-bold">${driverStats.totalEarnings.toFixed(2)}</p>
              </div>
              
              <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium">Rating</span>
                </div>
                <p className="text-2xl font-bold">{driverStats.rating}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Go Online
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
              <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{driverStats.vehicleInfo.make} {driverStats.vehicleInfo.model}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">{driverStats.vehicleInfo.year}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-medium">
                    {driverStats.vehicleInfo.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 mb-4">
              <div className="font-medium mb-2">License Plate</div>
              <div className="text-xl font-mono tracking-wider text-center py-1 px-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
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
                <span className="text-green-600 dark:text-green-400 font-medium">Verified driver</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
      
      {/* Upcoming Rides */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Upcoming Rides</CardTitle>
          <CardDescription>Rides scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingRides.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingRides.map((ride) => (
                <div key={ride.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                    <div className="md:w-1/4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{ride.time}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        ID: {ride.id}
                      </div>
                    </div>
                    
                    <div className="md:w-1/2">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full p-1.5 bg-primary/10">
                            <MapPin className="h-3 w-3 text-primary" />
                          </div>
                          <div className="w-0.5 h-8 bg-gray-200 dark:bg-gray-700 my-1"></div>
                          <div className="rounded-full p-1.5 bg-red-100 dark:bg-red-900/20">
                            <MapPin className="h-3 w-3 text-red-500 dark:text-red-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-2">
                            <div className="text-sm text-gray-500">Pickup</div>
                            <div className="font-medium">{ride.pickup}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Destination</div>
                            <div className="font-medium">{ride.destination}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="md:w-1/4">
                      <div className="flex flex-col">
                        <div className="font-medium">{ride.rider}</div>
                        <div className="text-sm text-gray-500 mb-2">{ride.distance}</div>
                        <div className="text-lg font-bold text-primary">
                          ${ride.fare.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">No upcoming rides scheduled</p>
              <Button variant="outline" className="mt-4">
                Find Rides
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}