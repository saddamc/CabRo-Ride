// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import useDebounce from "@/hooks/useDebounce";
// import { cn } from "@/lib/utils";
// import { useCalculateFareMutation, useGetNearbyDriversQuery, useLazyReverseGeocodeQuery, useLazySearchLocationsQuery, useRequestRideMutation, type IDriver, type ILocation } from "@/redux/features/ride-api";

// // import { useCalculateFareMutation, useGetNearbyDriversQuery, useLazyReverseGeocodeQuery, useLazySearchLocationsQuery, useRequestRideMutation } from "@/redux/features/ride/ride.api";
// import { ChevronRight, Clock, Loader2, MapPin, Navigation, Search, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// // Define ride types with their display names and icons
// const rideTypes = [
//   { id: "regular", name: "Regular", price: "৳120", image: "/car-regular.png" },
//   { id: "premium", name: "Premium", price: "৳180", image: "/car-premium.png" },
//   { id: "luxury", name: "Luxury", price: "৳280", image: "/car-luxury.png" },
// ];

// // Ride booking phases
// type BookingPhase = 
//   | "search_location" 
//   | "select_ride" 
//   | "searching_driver"
//   | "driver_found" 
//   | "driver_arriving" 
//   | "ride_in_progress"
//   | "ride_completed";

// export default function StartRide() {
//   const [bookingPhase, setBookingPhase] = useState<BookingPhase>("search_location");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<ILocation[]>([]);
//   const [selectedLocationType, setSelectedLocationType] = useState<"pickup" | "dropoff">("pickup");
//   const [pickupLocation, setPickupLocation] = useState<ILocation | null>(null);
//   const [dropoffLocation, setDropoffLocation] = useState<ILocation | null>(null);
//   const [selectedRideType, setSelectedRideType] = useState("regular");
//   const [rideDetails, setRideDetails] = useState<{
//     fare: number;
//     distance: number;
//     estimatedTime: number;
//   } | null>(null);
//   const [matchedDriver, setMatchedDriver] = useState<IDriver | null>(null);
  
//   const debouncedSearchTerm = useDebounce(searchQuery, 500);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   // State for ride management
//   const [currentRideId, setCurrentRideId] = useState<string | null>(null);
//   const [isPollingRideStatus, setIsPollingRideStatus] = useState(false);

//   // RTK Query hooks
//   const [searchLocations, { data: locationsData, isLoading: isSearching }] = useLazySearchLocationsQuery();
//   const [getReverseGeocode] = useLazyReverseGeocodeQuery();
//   const [calculateFare, { isLoading: isCalculating }] = useCalculateFareMutation();
//   const [requestRide, { isLoading: isRequestingRide }] = useRequestRideMutation();
//   const { data: nearbyDrivers } = useGetNearbyDriversQuery(
//     pickupLocation ?
//     {
//       lat: pickupLocation.coordinates[1],
//       lng: pickupLocation.coordinates[0],
//       rideType: selectedRideType
//     } :
//     { lat: 0, lng: 0 },
//     { skip: !pickupLocation || bookingPhase !== "searching_driver" }
//   );

//   // Effect to poll ride status when we have a ride ID
//   useEffect(() => {
//     if (currentRideId && isPollingRideStatus) {
//       const pollInterval = setInterval(async () => {
//         try {
//           // Here we would implement real-time ride status checking
//           // For now, we'll simulate the status progression
//           console.log('Polling ride status for:', currentRideId);

//           // In a real implementation, you would call an API endpoint to get ride status
//           // const rideStatus = await getRideStatus(currentRideId);

//         } catch (error) {
//           console.error('Error polling ride status:', error);
//         }
//       }, 5000); // Poll every 5 seconds

//       return () => clearInterval(pollInterval);
//     }
//   }, [currentRideId, isPollingRideStatus]);

//   // Search for locations when the search term changes
//   useEffect(() => {
//     if (debouncedSearchTerm.length >= 3) {
//       searchLocations(debouncedSearchTerm);
//     } else {
//       setSearchResults([]);
//     }
//   }, [debouncedSearchTerm, searchLocations]);

//   // Update search results when the API returns data
//   useEffect(() => {
//     if (locationsData) {
//       setSearchResults(locationsData);
//     }
//   }, [locationsData]);

//   // Get current location (for demo purposes only)
//   const getCurrentLocation = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(async (position) => {
//           const { latitude, longitude } = position.coords;
          
//           // Get address from coordinates
//           const response = await getReverseGeocode({ lat: latitude, lng: longitude });
          
//           if (response.data) {
//             if (selectedLocationType === "pickup") {
//               setPickupLocation(response.data);
//             } else {
//               setDropoffLocation(response.data);
//             }
//             // Clear search
//             setSearchQuery("");
//             setSearchResults([]);
//           }
//         });
//       } else {
//         toast({
//           title: "Geolocation not supported",
//           description: "Your browser does not support geolocation",
//           variant: "destructive",
//         });
//       }
//     } catch {
//       toast({
//         title: "Error getting location",
//         description: "Could not determine your current location",
//         variant: "destructive",
//       });
//     }
//   };

//   // Handle location selection
//   const handleLocationSelect = (location: ILocation) => {
//     if (selectedLocationType === "pickup") {
//       setPickupLocation(location);
//     } else {
//       setDropoffLocation(location);
//     }
//     setSearchQuery("");
//     setSearchResults([]);
    
//     // If both locations are selected, move to ride selection
//     if (
//       (selectedLocationType === "pickup" && dropoffLocation) ||
//       (selectedLocationType === "dropoff" && pickupLocation)
//     ) {
//       setBookingPhase("select_ride");
//       calculateRideFare();
//     }
//   };

//   // Calculate ride fare
//   const calculateRideFare = async () => {
//     if (!pickupLocation || !dropoffLocation) return;
    
//     try {
//       const result = await calculateFare({
//         pickupLocation,
//         dropoffLocation,
//         rideType: selectedRideType,
//       }).unwrap();
      
//       setRideDetails(result);
//     } catch {
//       toast({
//         title: "Error calculating fare",
//         description: "Could not calculate fare for this route",
//         variant: "destructive",
//       });
//     }
//   };

//   // Request a ride
//   const handleRequestRide = async () => {
//     if (!pickupLocation || !dropoffLocation || !rideDetails) {
//       toast({
//         title: "Missing information",
//         description: "Please select both pickup and dropoff locations",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setBookingPhase("searching_driver");

//       // Create ride request data with all required fields
//       const rideRequestData = {
//         pickupLocation: {
//           address: pickupLocation.address,
//           coordinates: pickupLocation.coordinates,
//         },
//         destinationLocation: {
//           address: dropoffLocation.address,
//           coordinates: dropoffLocation.coordinates,
//         },
//         notes: `Ride type: ${selectedRideType}`,
//       };

//       // Call API to create ride in database
//       const rideResponse = await requestRide(rideRequestData).unwrap();

//       toast({
//         title: "Ride requested successfully",
//         description: "Searching for available drivers...",
//       });

//       // Store the ride ID for status tracking
//       setCurrentRideId(rideResponse.id);
//       setIsPollingRideStatus(true);

//       // Simulate driver matching and status progression
//       // In a real app, this would be handled by WebSocket or polling to the backend
//       setTimeout(() => {
//         if (nearbyDrivers && nearbyDrivers.length > 0) {
//           // Select the first available driver
//           setMatchedDriver(nearbyDrivers[0]);
//           setBookingPhase("driver_found");

//           toast({
//             title: "Driver assigned",
//             description: `${nearbyDrivers[0].name} is on the way!`,
//           });

//           // Simulate driver arriving at pickup location
//           setTimeout(() => {
//             setBookingPhase("driver_arriving");

//             // Simulate ride starting (passenger picked up)
//             setTimeout(() => {
//               setBookingPhase("ride_in_progress");

//               toast({
//                 title: "Ride started",
//                 description: "Your ride is now in progress",
//               });

//               // Simulate ride completion
//               setTimeout(() => {
//                 setBookingPhase("ride_completed");

//                 toast({
//                   title: "Ride completed",
//                   description: "Thank you for riding with us!",
//                 });

//                 // Stop polling
//                 setIsPollingRideStatus(false);
//                 setCurrentRideId(null);

//               }, 15000); // Ride duration: 15 seconds

//             }, 8000); // Time to reach passenger: 8 seconds

//           }, 6000); // Driver travel time: 6 seconds

//         } else {
//           toast({
//             title: "No drivers available",
//             description: "Please try again later",
//             variant: "destructive",
//           });
//           setBookingPhase("select_ride");
//           setIsPollingRideStatus(false);
//           setCurrentRideId(null);
//         }
//       }, 4000); // Driver search time: 4 seconds

//     } catch (error) {
//       console.error('Error requesting ride:', error);
//       toast({
//         title: "Error requesting ride",
//         description: "Could not request a ride at this time. Please try again.",
//         variant: "destructive",
//       });
//       setBookingPhase("select_ride");
//       setIsPollingRideStatus(false);
//       setCurrentRideId(null);
//     }
//   };

//   // Clear selected locations and start over
//   const handleReset = () => {
//     setPickupLocation(null);
//     setDropoffLocation(null);
//     setSearchQuery("");
//     setSearchResults([]);
//     setSelectedLocationType("pickup");
//     setBookingPhase("search_location");
//     setRideDetails(null);
//     setMatchedDriver(null);
//   };

//   // Switch to searching pickup or dropoff
//   const handleStartLocationSearch = (type: "pickup" | "dropoff") => {
//     setSelectedLocationType(type);
//     setSearchQuery("");
//     setSearchResults([]);
//     if (searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   };

//   // Render location search UI
//   const renderLocationSearch = () => (
//     <div className="flex flex-col h-full">
//       <div className="p-4 bg-white rounded-t-lg border-b">
//         <h2 className="text-xl font-bold mb-4">Where are you going?</h2>
        
//         {/* Pickup location */}
//         <div className="flex items-center mb-3">
//           <div className="w-10 flex-shrink-0">
//             <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//               <MapPin size={16} />
//             </div>
//           </div>
//           <div 
//             className={cn(
//               "flex-grow p-2 border rounded-lg cursor-pointer hover:bg-gray-50",
//               selectedLocationType === "pickup" && "border-blue-500 bg-blue-50"
//             )}
//             onClick={() => handleStartLocationSearch("pickup")}
//           >
//             {pickupLocation ? (
//               <div className="flex justify-between items-center">
//                 <span className="font-medium truncate">{pickupLocation.name}</span>
//                 <X 
//                   className="text-gray-500 cursor-pointer" 
//                   size={16} 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setPickupLocation(null);
//                   }} 
//                 />
//               </div>
//             ) : (
//               <span className="text-gray-500">Enter pickup location</span>
//             )}
//           </div>
//         </div>
        
//         {/* Dropoff location */}
//         <div className="flex items-center">
//           <div className="w-10 flex-shrink-0">
//             <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//               <Navigation size={16} />
//             </div>
//           </div>
//           <div 
//             className={cn(
//               "flex-grow p-2 border rounded-lg cursor-pointer hover:bg-gray-50",
//               selectedLocationType === "dropoff" && "border-red-500 bg-red-50"
//             )}
//             onClick={() => handleStartLocationSearch("dropoff")}
//           >
//             {dropoffLocation ? (
//               <div className="flex justify-between items-center">
//                 <span className="font-medium truncate">{dropoffLocation.name}</span>
//                 <X 
//                   className="text-gray-500 cursor-pointer" 
//                   size={16} 
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setDropoffLocation(null);
//                   }} 
//                 />
//               </div>
//             ) : (
//               <span className="text-gray-500">Enter destination</span>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Search input */}
//       <div className="p-4 bg-white">
//         <div className="relative">
//           <Input
//             ref={searchInputRef}
//             type="text"
//             placeholder={`Search for ${selectedLocationType === "pickup" ? "pickup" : "destination"}...`}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 pr-10"
//           />
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//           {isSearching && (
//             <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 animate-spin" size={18} />
//           )}
//         </div>
//         <Button
//           variant="outline"
//           className="w-full mt-2 flex items-center justify-center"
//           onClick={getCurrentLocation}
//         >
//           <MapPin className="mr-2" size={16} />
//           Use current location
//         </Button>
//       </div>
      
//       {/* Search results */}
//       {searchResults.length > 0 && (
//         <div className="flex-1 overflow-y-auto p-2 bg-white">
//           <h3 className="text-sm font-medium px-2 py-1 text-gray-500">SUGGESTIONS</h3>
//           <ul className="divide-y">
//             {searchResults.map((location) => (
//               <li
//                 key={location.id}
//                 className="px-2 py-3 hover:bg-gray-100 cursor-pointer rounded"
//                 onClick={() => handleLocationSelect(location)}
//               >
//                 <div className="flex items-start">
//                   <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3 mt-1">
//                     <MapPin size={16} />
//                   </div>
//                   <div>
//                     <p className="font-medium">{location.name}</p>
//                     <p className="text-sm text-gray-500 truncate">{location.address}</p>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );

//   // Render ride selection UI
//   const renderRideSelection = () => (
//     <div className="flex flex-col h-full bg-white">
//       <div className="p-4 border-b">
//         <h2 className="text-xl font-bold mb-4">Choose your ride</h2>
        
//         {/* Pickup and dropoff summary */}
//         <div className="mb-4">
//           <div className="flex items-center mb-2">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                 <MapPin size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{pickupLocation?.name}</div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//                 <Navigation size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{dropoffLocation?.name}</div>
//           </div>
//         </div>
        
//         {/* Ride details */}
//         {rideDetails && (
//           <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
//             <div className="flex items-center">
//               <Clock size={16} className="mr-1" />
//               <span>{Math.ceil(rideDetails.estimatedTime)} min</span>
//             </div>
//             <div>
//               {(rideDetails.distance / 1000).toFixed(1)} km
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Ride types */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <div className="space-y-3">
//           {rideTypes.map((ride) => (
//             <div
//               key={ride.id}
//               className={cn(
//                 "border rounded-lg p-3 cursor-pointer",
//                 selectedRideType === ride.id ? "border-blue-500 bg-blue-50" : ""
//               )}
//               onClick={() => {
//                 setSelectedRideType(ride.id);
//                 calculateRideFare();
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-gray-100 rounded-full mr-3 overflow-hidden">
//                     <img
//                       src={ride.image}
//                       alt={ride.name}
//                       className="w-full h-full object-contain p-2"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-medium">{ride.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {rideDetails 
//                         ? `৳${Math.round(rideDetails.fare * (ride.id === "regular" ? 1 : ride.id === "premium" ? 1.5 : 2.3))}` 
//                         : ride.price}
//                     </p>
//                   </div>
//                 </div>
//                 <ChevronRight className="text-gray-400" size={20} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Action buttons */}
//       <div className="p-4 border-t">
//         <div className="flex gap-3">
//           <Button variant="outline" className="flex-1" onClick={handleReset}>
//             Cancel
//           </Button>
//           <Button 
//             className="flex-1" 
//             onClick={handleRequestRide}
//             disabled={isRequestingRide || isCalculating}
//           >
//             {isRequestingRide ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Requesting
//               </>
//             ) : (
//               `Book ${selectedRideType.charAt(0).toUpperCase() + selectedRideType.slice(1)}`
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );

//   // Render driver search/matching UI
//   const renderDriverSearch = () => (
//     <div className="flex flex-col items-center justify-center h-full p-6 bg-white">
//       <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
//         <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
//       </div>
//       <h2 className="text-xl font-bold mb-2">Finding your driver</h2>
//       <p className="text-gray-500 text-center mb-8">
//         Please wait while we connect you with a nearby driver...
//       </p>
//       <div className="w-full max-w-md">
//         <div className="flex items-center mb-2">
//           <div className="w-10 flex-shrink-0">
//             <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//               <MapPin size={16} />
//             </div>
//           </div>
//           <div className="font-medium truncate">{pickupLocation?.name}</div>
//         </div>
//         <div className="flex items-center">
//           <div className="w-10 flex-shrink-0">
//             <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//               <Navigation size={16} />
//             </div>
//           </div>
//           <div className="font-medium truncate">{dropoffLocation?.name}</div>
//         </div>
//       </div>
//       <Button variant="outline" className="mt-8 font-bold" onClick={handleReset}>
//         Cancel
//       </Button>
//     </div>
//   );

//   // Render driver found UI
//   const renderDriverFound = () => (
//     <div className="flex flex-col h-full bg-white">
//       <div className="p-6 text-center border-b">
//         <div className="flex justify-center mb-4">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={matchedDriver?.profileImage || ""} />
//             <AvatarFallback>{matchedDriver?.name?.charAt(0) || "D"}</AvatarFallback>
//           </Avatar>
//         </div>
//         <h2 className="text-xl font-bold">{matchedDriver?.name || "Driver"}</h2>
//         <div className="flex items-center justify-center mt-1">
//           <span className="text-yellow-500 mr-1">★</span>
//           <span>{matchedDriver?.rating || "4.8"}</span>
//         </div>
//         <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-500">Vehicle</span>
//             <span className="font-medium">
//               {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-500">Color</span>
//             <span className="font-medium">{matchedDriver?.vehicleInfo?.color}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-500">License plate</span>
//             <span className="font-medium">{matchedDriver?.vehicleInfo?.licensePlate}</span>
//           </div>
//         </div>
//       </div>
//       <div className="p-6 flex-1">
//         <div className="mb-4">
//           <h3 className="text-lg font-medium mb-2">Trip details</h3>
//           <div className="flex items-center mb-2">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                 <MapPin size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{pickupLocation?.name}</div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//                 <Navigation size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{dropoffLocation?.name}</div>
//           </div>
//         </div>
//         <div className="bg-blue-50 p-4 rounded-lg mb-4">
//           <div className="flex items-center">
//             <Clock className="text-blue-500 mr-2" size={20} />
//             <div>
//               <p className="text-sm text-blue-700">Driver is on the way</p>
//               <p className="font-medium">
//                 Arriving in {matchedDriver?.estimatedArrival || 5} minutes
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="p-4 border-t">
//         <Button variant="outline" className="w-full" onClick={handleReset}>
//           Cancel Ride
//         </Button>
//       </div>
//     </div>
//   );

//   // Render driver arriving UI
//   const renderDriverArriving = () => (
//     <div className="flex flex-col h-full bg-white">
//       <div className="p-6 text-center border-b">
//         <div className="flex justify-center mb-4">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={matchedDriver?.profileImage || ""} />
//             <AvatarFallback>{matchedDriver?.name?.charAt(0) || "D"}</AvatarFallback>
//           </Avatar>
//         </div>
//         <h2 className="text-xl font-bold">{matchedDriver?.name || "Driver"}</h2>
//         <div className="flex items-center justify-center mt-1">
//           <span className="text-yellow-500 mr-1">★</span>
//           <span>{matchedDriver?.rating || "4.8"}</span>
//         </div>
//         <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-500">Vehicle</span>
//             <span className="font-medium">
//               {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
//             </span>
//           </div>
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-gray-500">Color</span>
//             <span className="font-medium">{matchedDriver?.vehicleInfo?.color}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-500">License plate</span>
//             <span className="font-medium">{matchedDriver?.vehicleInfo?.licensePlate}</span>
//           </div>
//         </div>
//       </div>
//       <div className="p-6 flex-1">
//         <div className="mb-4">
//           <h3 className="text-lg font-medium mb-2">Trip details</h3>
//           <div className="flex items-center mb-2">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                 <MapPin size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{pickupLocation?.name}</div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//                 <Navigation size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{dropoffLocation?.name}</div>
//           </div>
//         </div>
//         <div className="bg-green-50 p-4 rounded-lg mb-4">
//           <div className="flex items-center">
//             <MapPin className="text-green-500 mr-2" size={20} />
//             <div>
//               <p className="text-sm text-green-700">Driver has arrived</p>
//               <p className="font-medium">
//                 Meet at pickup location
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="p-4 border-t">
//         <Button variant="outline" className="w-full" onClick={handleReset}>
//           Cancel Ride
//         </Button>
//       </div>
//     </div>
//   );

//   // Render ride in progress UI
//   const renderRideInProgress = () => (
//     <div className="flex flex-col h-full bg-white">
//       <div className="p-6 text-center border-b">
//         <div className="flex justify-center mb-4">
//           <Avatar className="h-20 w-20">
//             <AvatarImage src={matchedDriver?.profileImage || ""} />
//             <AvatarFallback>{matchedDriver?.name?.charAt(0) || "D"}</AvatarFallback>
//           </Avatar>
//         </div>
//         <h2 className="text-xl font-bold">{matchedDriver?.name || "Driver"}</h2>
//         <div className="flex items-center justify-center mt-1">
//           <span className="text-yellow-500 mr-1">★</span>
//           <span>{matchedDriver?.rating || "4.8"}</span>
//         </div>
//       </div>
//       <div className="p-6 flex-1">
//         <div className="mb-4">
//           <h3 className="text-lg font-medium mb-2">Trip details</h3>
//           <div className="flex items-center mb-2">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                 <MapPin size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{pickupLocation?.name}</div>
//           </div>
//           <div className="flex items-center">
//             <div className="w-10 flex-shrink-0">
//               <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
//                 <Navigation size={16} />
//               </div>
//             </div>
//             <div className="font-medium truncate">{dropoffLocation?.name}</div>
//           </div>
//         </div>
//         <Card className="mb-4">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Ride in progress</CardTitle>
//             <CardDescription>You'll arrive soon</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Distance</span>
//               <span className="font-medium">{rideDetails ? (rideDetails.distance / 1000).toFixed(1) + " km" : "3.2 km"}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Estimated time</span>
//               <span className="font-medium">{rideDetails ? Math.ceil(rideDetails.estimatedTime) + " min" : "15 min"}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Fare</span>
//               <span className="font-medium">
//                 ৳{rideDetails ? Math.round(rideDetails.fare * (selectedRideType === "regular" ? 1 : selectedRideType === "premium" ? 1.5 : 2.3)) : "350"}
//               </span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );

//   // Render ride completed UI
//   const renderRideCompleted = () => (
//     <div className="flex flex-col h-full bg-white">
//       <div className="p-6 text-center">
//         <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
//           <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <h2 className="text-xl font-bold mb-2">Ride Completed</h2>
//         <p className="text-gray-500 mb-6">Thanks for riding with us!</p>
        
//         <Card className="mb-6">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Trip Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Pickup</span>
//               <span className="font-medium text-right">{pickupLocation?.name}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Dropoff</span>
//               <span className="font-medium text-right">{dropoffLocation?.name}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Distance</span>
//               <span className="font-medium">{rideDetails ? (rideDetails.distance / 1000).toFixed(1) + " km" : "3.2 km"}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Duration</span>
//               <span className="font-medium">{rideDetails ? Math.ceil(rideDetails.estimatedTime) + " min" : "15 min"}</span>
//             </div>
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-500">Ride type</span>
//               <span className="font-medium capitalize">{selectedRideType}</span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Total fare</span>
//               <span className="font-medium">
//                 ৳{rideDetails ? Math.round(rideDetails.fare * (selectedRideType === "regular" ? 1 : selectedRideType === "premium" ? 1.5 : 2.3)) : "350"}
//               </span>
//             </div>
//           </CardContent>
//           <CardFooter className="border-t pt-4">
//             <div className="w-full flex justify-between items-center">
//               <div className="flex items-center">
//                 <Avatar className="h-10 w-10 mr-3">
//                   <AvatarImage src={matchedDriver?.profileImage || ""} />
//                   <AvatarFallback>{matchedDriver?.name?.charAt(0) || "D"}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="font-medium">{matchedDriver?.name || "Your driver"}</div>
//                   <div className="flex items-center text-sm">
//                     <span className="text-yellow-500 mr-1">★</span>
//                     <span>{matchedDriver?.rating || "4.8"}</span>
//                   </div>
//                 </div>
//               </div>
//               <Button variant="outline" size="sm">Rate</Button>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//       <div className="p-4 mt-auto">
//         <Button className="w-full" onClick={handleReset}>
//           Book Another Ride
//         </Button>
//       </div>
//     </div>
//   );

//   // Render based on booking phase
//   const renderContent = () => {
//     switch (bookingPhase) {
//       case "search_location":
//         return renderLocationSearch();
//       case "select_ride":
//         return renderRideSelection();
//       case "searching_driver":
//         return renderDriverSearch();
//       case "driver_found":
//         return renderDriverFound();
//       case "driver_arriving":
//         return renderDriverArriving();
//       case "ride_in_progress":
//         return renderRideInProgress();
//       case "ride_completed":
//         return renderRideCompleted();
//       default:
//         return renderLocationSearch();
//     }
//   };

//   return (
//     <div className="h-full max-w-md mx-auto bg-gray-50">
//       {renderContent()}
//     </div>
//   );
// }