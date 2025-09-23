import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Car, Clock, MapPin } from "lucide-react";

export default function BookRide() {
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a Ride</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Choose your pickup and destination to get started
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>Enter your ride information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-2 bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                      <MapPin className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup Location</label>
                      <input 
                        type="text" 
                        placeholder="Enter pickup location"
                        className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination</label>
                      <input 
                        type="text" 
                        placeholder="Enter destination"
                        className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                    <div className="mt-1 flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <input 
                        type="date" 
                        className="bg-transparent flex-1 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                    <div className="mt-1 flex items-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <input 
                        type="time" 
                        className="bg-transparent flex-1 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full">Search for Rides</Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Vehicles</CardTitle>
              <CardDescription>Select your preferred ride</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Economy</h4>
                    <p className="text-sm text-gray-500">4 seats • Best price</p>
                  </div>
                  <div className="ml-auto font-semibold">$12.50</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <Car className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Premium</h4>
                    <p className="text-sm text-gray-500">4 seats • Comfort</p>
                  </div>
                  <div className="ml-auto font-semibold">$18.75</div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                    <Car className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">XL</h4>
                    <p className="text-sm text-gray-500">6 seats • Groups</p>
                  </div>
                  <div className="ml-auto font-semibold">$22.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}