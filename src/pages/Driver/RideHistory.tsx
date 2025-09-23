import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Car, Clock, FileClock, MapPin, Route, User } from "lucide-react";
import { useState } from "react";

export default function DriverRideHistory() {
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Mock ride history data
  const rideHistory = [
    {
      id: "RID-12345",
      date: "2023-09-15T14:30:00",
      rider: "John Smith",
      pickup: "123 Main Street",
      destination: "Airport Terminal B",
      distance: "18.5 miles",
      duration: "45 mins",
      fare: 42.75,
      status: "completed",
      rating: 5
    },
    {
      id: "RID-12344",
      date: "2023-09-14T09:15:00",
      rider: "Emily Johnson",
      pickup: "Central Station",
      destination: "Business District",
      distance: "7.2 miles",
      duration: "22 mins",
      fare: 18.50,
      status: "completed",
      rating: 4
    },
    {
      id: "RID-12343",
      date: "2023-09-13T16:45:00",
      rider: "Michael Brown",
      pickup: "Shopping Mall",
      destination: "Westside Apartments",
      distance: "10.4 miles",
      duration: "30 mins",
      fare: 24.30,
      status: "completed",
      rating: 5
    },
    {
      id: "RID-12342",
      date: "2023-09-12T20:10:00",
      rider: "Jessica Williams",
      pickup: "Restaurant Row",
      destination: "Highland Residences",
      distance: "5.8 miles",
      duration: "18 mins",
      fare: 15.75,
      status: "cancelled",
      cancellationReason: "Rider no-show"
    },
    {
      id: "RID-12341",
      date: "2023-09-11T11:30:00",
      rider: "David Miller",
      pickup: "Medical Center",
      destination: "University Campus",
      distance: "3.2 miles",
      duration: "12 mins",
      fare: 9.80,
      status: "completed",
      rating: 5
    },
    {
      id: "RID-12340",
      date: "2023-09-10T08:00:00",
      rider: "Sarah Davis",
      pickup: "Sunrise Apartments",
      destination: "Downtown Office Tower",
      distance: "8.9 miles",
      duration: "25 mins",
      fare: 21.45,
      status: "cancelled",
      cancellationReason: "Driver cancelled - vehicle issue"
    }
  ];

  // Filter rides based on status
  const filteredRides = filterStatus === "all" 
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
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">{status}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800">{status}</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          View details of all your past rides
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ride Statistics</CardTitle>
          <CardDescription>Your riding activity summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Rides</span>
              </div>
              <p className="text-2xl font-bold">{rideHistory.filter(ride => ride.status === "completed").length}</p>
            </div>
            
            <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Route className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium">Total Distance</span>
              </div>
              <p className="text-2xl font-bold">
                {rideHistory
                  .filter(ride => ride.status === "completed")
                  .reduce((acc, ride) => acc + parseFloat(ride.distance), 0)
                  .toFixed(1)} miles
              </p>
            </div>
            
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium">Driving Time</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.floor(rideHistory
                  .filter(ride => ride.status === "completed")
                  .reduce((acc, ride) => {
                    const [hours, mins] = ride.duration.split(' ')[0].split(':');
                    return acc + (hours ? parseInt(hours) * 60 : 0) + parseInt(mins || '0');
                  }, 0) / 60)} hrs
              </p>
            </div>
            
            <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
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
                  key={ride.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="w-full md:w-1/4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formatDate(ride.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{ride.rider}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ride.status)}
                        <span className="text-sm text-gray-500">{ride.id}</span>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-2/4">
                      <div className="flex items-start gap-3 mb-4">
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
                    
                    <div className="w-full md:w-1/4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Distance</span>
                          <span className="font-medium">{ride.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium">{ride.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fare</span>
                          <span className="font-medium text-primary">${ride.fare.toFixed(2)}</span>
                        </div>
                        {ride.status === "completed" && ride.rating && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Rating</span>
                            <div className="flex items-center">
                              {Array(5).fill(0).map((_, i) => (
                                <svg 
                                  key={i}
                                  className={`w-4 h-4 ${i < ride.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                  xmlns="http://www.w3.org/2000/svg" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        )}
                        {ride.status === "cancelled" && ride.cancellationReason && (
                          <div className="pt-1">
                            <span className="text-sm text-red-500">{ride.cancellationReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No rides found matching your filter</p>
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
          <div className="text-sm text-gray-500">
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
    </div>
  );
}