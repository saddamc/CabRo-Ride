import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Calendar, Car, Clock, Mail, MapPin, Phone, Shield, Star, User } from "lucide-react";

export default function RiderDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  
  // Mock current location
  const currentLocation = "123 Main Street, New York";
  
  // Mock popular destinations
  const popularDestinations = [
    { id: 1, name: "Central Park", distance: "2.5 miles", eta: "15 min" },
    { id: 2, name: "Grand Central Station", distance: "1.8 miles", eta: "12 min" },
    { id: 3, name: "Times Square", distance: "3.2 miles", eta: "20 min" }
  ];
  
  // Mock upcoming ride
  const upcomingRide = {
    id: "RID-12349",
    date: "September 24, 2025",
    time: "09:30 AM",
    pickup: "123 Main Street",
    destination: "Airport Terminal 4",
    driver: "Michael Brown",
    vehicle: "Toyota Camry (ABC-1234)",
    fare: 45.00,
    status: "scheduled"
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, <span className="text-primary">{userInfo?.data?.name || 'Rider'}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Ready for your next journey?
        </p>
      </div>
      
      {/* Current Location and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
              <Button className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Book Now
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
                <span className="text-green-600 dark:text-green-400 font-medium">Verified account</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Upcoming Ride */}
      {upcomingRide && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Ride</CardTitle>
            <CardDescription>Your scheduled ride details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap md:flex-nowrap items-start gap-6">
              <div className="w-full md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{upcomingRide.date}</div>
                    <div className="text-sm text-gray-500">{upcomingRide.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                      <MapPin className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="text-sm text-gray-500">Pickup</div>
                      <div className="font-medium">{upcomingRide.pickup}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{upcomingRide.destination}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h4 className="font-medium mb-3">Ride Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver</span>
                    <span className="font-medium">{upcomingRide.driver}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vehicle</span>
                    <span className="font-medium">{upcomingRide.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estimated fare</span>
                    <span className="font-medium">${upcomingRide.fare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-green-600 dark:text-green-400 capitalize">{upcomingRide.status}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Cancel</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
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