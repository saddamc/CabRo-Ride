import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group-simple";
import { Textarea } from "@/components/ui/textarea";
import { Car, Clock, CreditCard, Info, MapPin, Navigation, ReceiptText, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverBookRide() {
  const navigate = useNavigate();
  const [bookingStep, setBookingStep] = useState(1);
  const [rideType, setRideType] = useState("standard");
  
  // Drivers should be able to see ride requests, not book rides
  // Redirect to dashboard after short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/driver/dashboard", { replace: true });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Mock locations for quick selection
  const savedLocations = [
    { id: 1, name: "Home", address: "123 Main Street, New York", type: "home" },
    { id: 2, name: "Work", address: "456 Business Plaza, New York", type: "work" },
    { id: 3, name: "Gym", address: "789 Fitness Center, New York", type: "gym" }
  ];
  
  // Mock ride options
  const rideOptions = [
    { 
      id: "standard",
      name: "Standard", 
      description: "Regular vehicle, affordable price",
      icon: Car,
      estimatedPrice: "12.50 - 15.00",
      estimatedTime: "12 min",
      available: true
    },
    { 
      id: "premium",
      name: "Premium", 
      description: "Luxury vehicle, comfortable ride",
      icon: Car,
      estimatedPrice: "18.75 - 22.50",
      estimatedTime: "15 min",
      available: true
    },
    { 
      id: "shared",
      name: "Shared Ride", 
      description: "Share with other riders, lowest price",
      icon: User,
      estimatedPrice: "8.25 - 10.50",
      estimatedTime: "20 min",
      available: false
    }
  ];
  
  // Handle next step
  const nextStep = () => {
    setBookingStep(prev => Math.min(prev + 1, 3));
  };
  
  // Handle previous step
  const prevStep = () => {
    setBookingStep(prev => Math.max(prev - 1, 1));
  };
  
  // Get step content
  const getStepContent = () => {
    switch (bookingStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Enter Ride Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="mt-1.5 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="pickup" 
                      placeholder="Enter pickup address" 
                      className="pl-9" 
                      defaultValue="Current Location"
                    />
                  </div>
                  
                  {savedLocations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {savedLocations.map(location => (
                        <Button 
                          key={location.id}
                          variant="outline" 
                          size="sm"
                          className="h-7 text-xs flex items-center"
                        >
                          {location.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <div className="mt-1.5 relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="destination" 
                      placeholder="Where are you going?" 
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <Label className="mb-3 block">Ride Schedule</Label>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-3">
                      <input type="radio" id="now" name="schedule" defaultChecked className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="now" className="font-medium">Ride Now</Label>
                        <div className="text-sm text-gray-500">
                          Request a driver immediately
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-y-0 border rounded-lg p-3">
                      <input type="radio" id="schedule" name="schedule" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="schedule" className="font-medium">Schedule for Later</Label>
                        <div className="text-sm text-gray-500 mb-2">
                          Reserve a ride for a future time
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input type="date" disabled className="col-span-1" />
                          <Input type="time" disabled className="col-span-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={nextStep}>
                Continue
              </Button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Choose Ride Type</h3>
              
              <RadioGroup value={rideType} onValueChange={setRideType} className="space-y-3">
                {rideOptions.map(option => (
                  <div 
                    key={option.id}
                    className={`flex items-start space-x-3 space-y-0 border rounded-lg p-4 ${
                      !option.available ? 'opacity-60' : ''
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={option.id} disabled={!option.available} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-primary/10">
                            <option.icon className="h-4 w-4 text-primary" />
                          </div>
                          <Label htmlFor={option.id} className="font-medium">{option.name}</Label>
                        </div>
                        <div className="text-primary font-semibold">
                          ${option.estimatedPrice}
                        </div>
                      </div>
                      
                      <div className="mt-1 text-sm text-gray-500">
                        {option.description}
                      </div>
                      
                      <div className="mt-2 flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-500" />
                          <span>{option.estimatedTime}</span>
                        </div>
                        {!option.available && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                            Currently Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special instructions for the driver?" 
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Payment Method</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Visa •••• 4567</div>
                      <div className="text-sm text-gray-500">Default payment method</div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>
                Review Ride
              </Button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Review and Confirm</h3>
              
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full p-2 bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="w-0.5 h-16 bg-gray-200 dark:bg-gray-700 my-1"></div>
                      <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                        <MapPin className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <div className="text-sm text-gray-500">Pickup</div>
                        <div className="font-medium">Current Location</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Destination</div>
                        <div className="font-medium">Times Square, New York</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-500">Ride Type</div>
                      <div className="font-medium capitalize flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        {rideType === "standard" ? "Standard" : rideType === "premium" ? "Premium" : "Shared Ride"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Payment Method</div>
                      <div className="font-medium flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Visa •••• 4567
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estimated Time</div>
                      <div className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {rideOptions.find(o => o.id === rideType)?.estimatedTime || "15 min"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estimated Price</div>
                      <div className="font-medium text-primary">
                        ${rideOptions.find(o => o.id === rideType)?.estimatedPrice || "15.00 - 18.00"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 rounded-lg">
                    <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">Price Estimate</p>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Final price may vary based on traffic, weather, and other factors. You'll only be charged after your ride is complete.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button className="gap-2">
                  <ReceiptText className="h-4 w-4" />
                  Confirm Ride
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a Ride</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Fill out the details to request your next ride
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>Step {bookingStep} of 3</CardDescription>
            </CardHeader>
            <CardContent>
              {getStepContent()}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pickup</span>
                  <span className="font-medium text-right">Current Location</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-medium text-right">
                    {bookingStep >= 2 ? "Times Square, New York" : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ride Type</span>
                  <span className="font-medium capitalize">
                    {bookingStep >= 2 ? rideType : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Price</span>
                  <span className="font-medium text-primary">
                    {bookingStep >= 2 ? `$${rideOptions.find(o => o.id === rideType)?.estimatedPrice || "15.00 - 18.00"}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Estimated Time</span>
                  <span className="font-medium">
                    {bookingStep >= 2 ? rideOptions.find(o => o.id === rideType)?.estimatedTime || "15 min" : "-"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 flex flex-col items-stretch pt-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total</span>
                <span className="font-bold text-primary">
                  {bookingStep >= 2 ? `$${rideOptions.find(o => o.id === rideType)?.estimatedPrice || "15.00 - 18.00"}` : "-"}
                </span>
              </div>
              <Button disabled={bookingStep < 3} className="w-full">
                Confirm Booking
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}