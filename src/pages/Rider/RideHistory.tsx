import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";

const rideHistory = [
  {
    id: "RID-12345",
    date: "September 22, 2025",
    time: "14:30 PM",
    pickup: "123 Main Street",
    destination: "456 Park Avenue",
    driver: "John Doe",
    vehicle: "Toyota Camry (ABC-1234)",
    fare: 18.50,
    status: "completed"
  },
  {
    id: "RID-12346",
    date: "September 20, 2025",
    time: "09:15 AM",
    pickup: "Central Park",
    destination: "Grand Central Station",
    driver: "Jane Smith",
    vehicle: "Honda Civic (XYZ-5678)",
    fare: 12.75,
    status: "completed"
  },
  {
    id: "RID-12347",
    date: "September 18, 2025",
    time: "19:45 PM",
    pickup: "Brooklyn Bridge",
    destination: "Times Square",
    driver: "Mike Johnson",
    vehicle: "Hyundai Sonata (DEF-9012)",
    fare: 22.30,
    status: "completed"
  },
  {
    id: "RID-12348",
    date: "September 15, 2025",
    time: "11:20 AM",
    pickup: "Empire State Building",
    destination: "Statue of Liberty Ferry",
    driver: "Sarah Williams",
    vehicle: "Ford Fusion (GHI-3456)",
    fare: 15.90,
    status: "completed"
  }
];

export default function RideHistory() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ride History</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          View your past rides and receipts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rideHistory.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52.7 mi</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${rideHistory.reduce((sum, ride) => sum + ride.fare, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rideHistory.map((ride) => (
              <div key={ride.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{ride.date}</div>
                      <div className="text-sm text-gray-500">{ride.time}</div>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1 rounded-full text-sm font-medium text-green-800 dark:text-green-300 capitalize">
                    {ride.status}
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
                      <div className="font-medium">{ride.pickup}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Destination</div>
                      <div className="font-medium">{ride.destination}</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <div className="text-sm text-gray-500">Driver</div>
                    <div className="font-medium">{ride.driver}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Vehicle</div>
                    <div className="font-medium">{ride.vehicle}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Fare</div>
                    <div className="font-medium text-primary">${ride.fare.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}