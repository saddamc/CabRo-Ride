// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Car, Check, Clock, DollarSign, MapPin, MessageSquare, Navigation, Phone, ShieldCheck, Star, X } from "lucide-react";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// // Define ride states for the step-by-step process
// type RideState = 
//   | "input" 
//   | "searching" 
//   | "driverFound" 
//   | "driverArriving" 
//   | "inProgress" 
//   | "completed"
//   | "rated";

// export default function StartRide() {
//   const [pickupLocation, setPickupLocation] = useState("Unnamed Road, Dhaka");
//   const [destination, setDestination] = useState("");
//   const [rideState, setRideState] = useState<RideState>("input");
//   const [selectedRideType, setSelectedRideType] = useState("standard");
//   const [rating, setRating] = useState(5);
  
//   // Mock data for the driver
//   const driverInfo = {
//     name: "Muhammad Ali",
//     phone: "+8801712345678",
//     rating: 4.8,
//     totalRides: 3240,
//     car: "Toyota Corolla",
//     plate: "DHA-45-3908",
//     eta: "5 min",
//     photo: "https://ui-avatars.com/api/?name=Muhammad+Ali&background=10b981&color=fff&size=128"
//   };

//   // Mock ride price
//   const ridePrice = 350;
  
//   // Request a ride - Transition to searching state
//   const handleRequestRide = () => {
//     if (!destination) {
//       alert("Please enter a destination");
//       return;
//     }
//     setRideState("searching");
    
//     // Simulate finding a driver after 3 seconds
//     setTimeout(() => {
//       setRideState("driverFound");
//     }, 3000);
//   };
  
//   // Cancel ride
//   const handleCancelRide = () => {
//     setRideState("input");
//     setDestination("");
//   };
  
//   // Accept driver
//   const handleAcceptDriver = () => {
//     setRideState("driverArriving");
    
//     // Simulate driver arriving after 5 seconds
//     setTimeout(() => {
//       setRideState("inProgress");
      
//       // Simulate ride completion after 10 seconds
//       setTimeout(() => {
//         setRideState("completed");
//       }, 10000);
//     }, 5000);
//   };
  
//   // Complete ride and rate driver
//   const handleRateDriver = () => {
//     setRideState("rated");
    
//     // Reset after showing thank you message
//     setTimeout(() => {
//       setRideState("input");
//       setDestination("");
//       setRating(5);
//     }, 5000);
//   };

//   // Ride type options
//   const rideTypes = [
//     {
//       id: "economy",
//       name: "Economy",
//       price: (ridePrice * 0.8).toFixed(0),
//       time: "18 min",
//       icon: <Car className="h-5 w-5" />
//     },
//     {
//       id: "standard",
//       name: "Standard",
//       price: ridePrice.toFixed(0),
//       time: "15 min",
//       icon: <Car className="h-5 w-5" />
//     },
//     {
//       id: "premium",
//       name: "Premium",
//       price: (ridePrice * 1.5).toFixed(0),
//       time: "12 min",
//       icon: <Car className="h-5 w-5" />
//     }
//   ];

//   return (
//     <div className="mx-auto max-w-md px-4 py-6">
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-6">
//           {/* Header */}
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {rideState === "input" && "Get ready for your first trip"}
//               {rideState === "searching" && "Finding your driver"}
//               {rideState === "driverFound" && "Driver found"}
//               {rideState === "driverArriving" && "Driver is on the way"}
//               {rideState === "inProgress" && "Enjoy your ride"}
//               {rideState === "completed" && "Rate your trip"}
//               {rideState === "rated" && "Thank you!"}
//             </h2>
//             <p className="text-gray-500 text-sm mt-1">
//               {rideState === "input" && "Discover the convenience of ride-sharing. Request a ride now, or schedule one for later."}
//               {rideState === "searching" && "Please wait while we connect you with a nearby driver..."}
//               {rideState === "driverFound" && "A driver has accepted your ride request"}
//               {rideState === "driverArriving" && `${driverInfo.name} is heading to your pickup location`}
//               {rideState === "inProgress" && "You're on your way to your destination"}
//               {rideState === "completed" && "How was your ride with " + driverInfo.name + "?"}
//               {rideState === "rated" && "We appreciate your feedback!"}
//             </p>
//           </div>

//           {/* Input Fields - Only shown in input state */}
//           {rideState === "input" && (
//             <div className="space-y-4">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <MapPin className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   value={pickupLocation}
//                   onChange={(e) => setPickupLocation(e.target.value)}
//                   className="pl-10"
//                   placeholder="Enter pickup location"
//                   disabled
//                 />
//               </div>

//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                   <MapPin className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <Input
//                   value={destination}
//                   onChange={(e) => setDestination(e.target.value)}
//                   className="pl-10"
//                   placeholder="Enter destination"
//                 />
//               </div>

//               {destination && (
//                 <div className="space-y-4 mt-6">
//                   <h3 className="font-medium">Select ride type:</h3>
//                   <div className="grid grid-cols-1 gap-3">
//                     {rideTypes.map((type) => (
//                       <div
//                         key={type.id}
//                         className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
//                           selectedRideType === type.id
//                             ? "border-primary bg-primary/5"
//                             : "border-gray-200 hover:bg-gray-50"
//                         }`}
//                         onClick={() => setSelectedRideType(type.id)}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="p-2 bg-gray-100 rounded-full">
//                             {type.icon}
//                           </div>
//                           <div>
//                             <h4 className="font-medium">{type.name}</h4>
//                             <p className="text-sm text-gray-500">{type.time}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className="font-bold">৳ {type.price}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <Button
//                 onClick={handleRequestRide}
//                 className="w-full mt-4"
//                 disabled={!destination}
//               >
//                 Request Ride
//               </Button>
//             </div>
//           )}

//           {/* Searching for Driver */}
//           {rideState === "searching" && (
//             <div className="py-8 flex flex-col items-center">
//               <div className="animate-pulse rounded-full bg-primary/20 p-8 mb-4">
//                 <Car className="h-12 w-12 text-primary animate-bounce" />
//               </div>
//               <p className="text-center text-gray-600 mb-6">Connecting you with drivers nearby...</p>
//               <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
//                 <div className="bg-primary h-2.5 rounded-full animate-[progress_3s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
//               </div>
//               <Button
//                 variant="outline"
//                 onClick={handleCancelRide}
//                 className="mt-2"
//               >
//                 <X className="h-4 w-4 mr-2" /> Cancel
//               </Button>
//             </div>
//           )}

//           {/* Driver Found */}
//           {rideState === "driverFound" && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={driverInfo.photo}
//                   alt={driverInfo.name}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="font-semibold text-lg">{driverInfo.name}</h3>
//                   <div className="flex items-center gap-1 text-sm">
//                     <Star className="h-4 w-4 text-yellow-500 fill-current" />
//                     <span>{driverInfo.rating}</span>
//                     <span className="text-gray-400">({driverInfo.totalRides} trips)</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-gray-50 rounded-lg space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Car className="h-5 w-5 text-gray-500" />
//                     <span className="text-sm text-gray-700">{driverInfo.car}</span>
//                   </div>
//                   <span className="font-medium">{driverInfo.plate}</span>
//                 </div>
                
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Clock className="h-5 w-5 text-gray-500" />
//                     <span className="text-sm text-gray-700">Estimated arrival</span>
//                   </div>
//                   <span className="font-medium">{driverInfo.eta}</span>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <ShieldCheck className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <p className="text-sm text-blue-700">
//                   Driver details have been verified for your safety
//                 </p>
//               </div>
              
//               <div className="grid grid-cols-2 gap-3 mt-2">
//                 <Button
//                   variant="outline"
//                   onClick={handleCancelRide}
//                   className="flex items-center justify-center gap-2"
//                 >
//                   <X className="h-4 w-4" /> Cancel
//                 </Button>
//                 <Button
//                   onClick={handleAcceptDriver}
//                   className="flex items-center justify-center gap-2"
//                 >
//                   <Check className="h-4 w-4" /> Accept
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Driver Arriving */}
//           {rideState === "driverArriving" && (
//             <div className="space-y-6">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={driverInfo.photo}
//                   alt={driverInfo.name}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="font-semibold text-lg">{driverInfo.name}</h3>
//                   <div className="flex items-center gap-1 text-sm">
//                     <Star className="h-4 w-4 text-yellow-500 fill-current" />
//                     <span>{driverInfo.rating}</span>
//                     <span className="text-gray-400">({driverInfo.totalRides} trips)</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <div className="absolute top-0 left-4 w-0.5 h-full bg-gray-200"></div>
//                 <div className="relative z-10 flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-primary rounded-full">
//                     <MapPin className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Pickup</p>
//                     <p className="font-medium">{pickupLocation}</p>
//                   </div>
//                 </div>
                
//                 <div className="relative z-10 flex items-center gap-3">
//                   <div className="p-2 bg-red-500 rounded-full">
//                     <MapPin className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Destination</p>
//                     <p className="font-medium">{destination}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-center">
//                 <p className="text-green-700 font-medium">Your driver is on the way!</p>
//                 <p className="text-sm text-green-600 mt-1">Estimated arrival in {driverInfo.eta}</p>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <Button
//                   variant="outline"
//                   className="flex items-center justify-center gap-2"
//                   asChild
//                 >
//                   <a href={`tel:${driverInfo.phone}`}>
//                     <Phone className="h-4 w-4" /> Call
//                   </a>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="flex items-center justify-center gap-2"
//                 >
//                   <MessageSquare className="h-4 w-4" /> Message
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Ride in Progress */}
//           {rideState === "inProgress" && (
//             <div className="space-y-6">
//               <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
//                 <p className="text-blue-700 font-medium">Your ride is in progress</p>
//                 <p className="text-sm text-blue-600 mt-1">Sit back and relax</p>
//               </div>
              
//               <div className="relative">
//                 <div className="absolute top-0 left-4 w-0.5 h-full bg-gray-200"></div>
//                 <div className="relative z-10 flex items-center gap-3 mb-6">
//                   <div className="p-2 bg-primary/20 rounded-full">
//                     <MapPin className="h-4 w-4 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Pickup</p>
//                     <p className="font-medium">{pickupLocation}</p>
//                   </div>
//                 </div>
                
//                 <div className="relative z-10 flex items-center gap-3">
//                   <div className="p-2 bg-red-500 rounded-full animate-pulse">
//                     <Navigation className="h-4 w-4 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500">Destination</p>
//                     <p className="font-medium">{destination}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-center justify-between mb-3">
//                   <span className="text-gray-600">Estimated arrival</span>
//                   <span className="font-medium">12 minutes</span>
//                 </div>
                
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
//                 </div>
                
//                 <div className="flex justify-between text-xs text-gray-500 mt-1">
//                   <span>{pickupLocation.split(',')[0]}</span>
//                   <span>{destination.split(',')[0]}</span>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-4">
//                 <img
//                   src={driverInfo.photo}
//                   alt={driverInfo.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <h3 className="font-medium">{driverInfo.name}</h3>
//                   <p className="text-sm text-gray-500">{driverInfo.car} · {driverInfo.plate}</p>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <Button
//                   variant="outline"
//                   className="flex items-center justify-center gap-2"
//                   asChild
//                 >
//                   <a href={`tel:${driverInfo.phone}`}>
//                     <Phone className="h-4 w-4" /> Call
//                   </a>
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="flex items-center justify-center gap-2"
//                 >
//                   <MessageSquare className="h-4 w-4" /> Message
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Ride Completed - Rating */}
//           {rideState === "completed" && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
//                   <Check className="h-10 w-10 text-green-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-1">Ride Completed!</h3>
//                 <p className="text-gray-500 mb-4">Thanks for riding with us.</p>
//               </div>
              
//               <div className="p-4 bg-gray-50 rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <span>Ride fare</span>
//                   <span className="text-lg font-bold">৳ {rideTypes.find(t => t.id === selectedRideType)?.price || ridePrice}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm text-gray-500">
//                   <span>Payment method</span>
//                   <span className="flex items-center gap-1">
//                     <DollarSign className="h-4 w-4" /> Cash
//                   </span>
//                 </div>
//               </div>
              
//               <div className="flex flex-col items-center">
//                 <p className="mb-3 font-medium">Rate your experience with {driverInfo.name}</p>
//                 <div className="flex items-center gap-1 mb-6">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       onClick={() => setRating(star)}
//                       className="focus:outline-none"
//                     >
//                       <Star
//                         className={`h-8 w-8 ${
//                           star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                         }`}
//                       />
//                     </button>
//                   ))}
//                 </div>
                
//                 <Button
//                   onClick={handleRateDriver}
//                   className="w-full"
//                 >
//                   Submit Rating
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Thank You Message */}
//           {rideState === "rated" && (
//             <div className="py-8 text-center space-y-6">
//               <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
//                 <Check className="h-10 w-10 text-primary" />
//               </div>
              
//               <div>
//                 <h3 className="text-xl font-semibold mb-2">Thank you for your feedback!</h3>
//                 <p className="text-gray-500">Your rating helps us improve our service.</p>
//               </div>
              
//               <div className="flex justify-center gap-4">
//                 <Link to="/rider/history">
//                   <Button variant="outline">View Ride History</Button>
//                 </Link>
//                 <Button onClick={() => setRideState("input")}>
//                   New Ride
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
