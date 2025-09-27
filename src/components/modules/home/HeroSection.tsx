// import Logo from "@/assets/icons/Logo";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import useDebounce from "@/hooks/useDebounce";
// import type { ILocation } from "@/redux/features/ride/ride.api";
// import { useLazySearchLocationsQuery } from "@/redux/features/ride/ride.api";
// import { MapPin, Search } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function HeroSection() {
//     const navigate = useNavigate();
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState<ILocation[]>([]);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const debouncedSearchTerm = useDebounce(searchQuery, 500);
//     const searchContainerRef = useRef<HTMLDivElement>(null);

//     // RTK Query hooks
//     const [searchLocations, { data: locationsData, isLoading: isSearching }] = useLazySearchLocationsQuery();

//     useEffect(() => {
//         if (debouncedSearchTerm.length >= 3) {
//             searchLocations(debouncedSearchTerm);
//             setIsDropdownOpen(true);
//         } else {
//             setSearchResults([]);
//             setIsDropdownOpen(false);
//         }
//     }, [debouncedSearchTerm, searchLocations]);

//     useEffect(() => {
//         if (locationsData) {
//             setSearchResults(locationsData);
//         }
//     }, [locationsData]);

//     // For testing - populate with mock data if no real data
//     useEffect(() => {
//         // Only use mock data if no real data received after searching
//         if (debouncedSearchTerm.length >= 3 && !isSearching && (!searchResults || searchResults.length === 0)) {
//             const mockLocations: ILocation[] = [
//                 {
//                     id: 'mock-1',
//                     name: 'Dhaka City Center',
//                     address: 'Central Dhaka, Bangladesh',
//                     coordinates: [90.4125, 23.8103] as [number, number],
//                     type: 'city'
//                 },
//                 {
//                     id: 'mock-2',
//                     name: 'Gulshan Avenue',
//                     address: 'Gulshan, Dhaka, Bangladesh',
//                     coordinates: [90.4152, 23.7925] as [number, number],
//                     type: 'street'
//                 },
//                 {
//                     id: 'mock-3',
//                     name: `${debouncedSearchTerm} Plaza`,
//                     address: `Near ${debouncedSearchTerm}, Dhaka, Bangladesh`,
//                     coordinates: [90.3765, 23.7551] as [number, number],
//                     type: 'building'
//                 }
//             ];
            
//             setSearchResults(mockLocations);
//         }
//     }, [debouncedSearchTerm, isSearching, searchResults]);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
//                 setIsDropdownOpen(false);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, []);

//     const handleLocationSelect = (location: ILocation) => {
//         setSearchQuery(location.name);
//         setIsDropdownOpen(false);
        
//         // Check if user is logged in and redirect accordingly
//         const accessToken = localStorage.getItem("accessToken");
//         if (accessToken) {
//             navigate("/rider/ride-booking", { 
//                 state: { 
//                     selectedLocation: location 
//                 }
//             });
//         } else {
//             // If not logged in, prompt to login first
//             navigate("/login", {
//                 state: {
//                     from: "/rider/ride-booking",
//                     locationData: location
//                 }
//             });
//         }
//     };

//     const handleCheckPrice = () => {
//         // Check if user is logged in and redirect accordingly
//         const accessToken = localStorage.getItem("accessToken");
//         if (accessToken) {
//             navigate("/rider/ride-booking");
//         } else {
//             navigate("/login", { 
//                 state: { 
//                     from: "/rider/ride-booking" 
//                 }
//             });
//         }
//     };

//     return (
//         <section className="relative overflow-hidden py-32 min-h-screen">
//             <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
//                 <img
//                     alt="background"
//                     src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
//                     className="[mask-image:radial-gradient(75%_75%_at_center,white,transparent)] opacity-90"
//                 />
//             </div>
//             <div className="relative z-10 container mx-auto">
//                 <div className="mx-auto flex max-w-5xl flex-col items-center">
//                     <div className="flex flex-col items-center gap-6 text-center">
//                         <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
//                             <Logo />
//                         </div>
//                         <div>
//                             <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
//                                 Your Ride, <span className="text-primary">Simplified</span>
//                             </h1>
//                             <p className="mx-auto max-w-3xl text-muted-foreground lg:text-xl">
//                                 Affordable, reliable, and trusted rides at your fingertips — anytime, anywhere.
//                                 Book your ride in seconds and enjoy a comfortable journey to your destination.
//                             </p>
//                         </div>
//                         <div className="mt-6 w-full max-w-md">
//                             <div className="relative" ref={searchContainerRef}>
//                                 <div className="flex">
//                                     <div className="relative flex-grow">
//                                         <Input
//                                             type="text"
//                                             placeholder="Where are you going?"
//                                             value={searchQuery}
//                                             onChange={(e) => setSearchQuery(e.target.value)}
//                                             className="pl-10 pr-4 h-12 text-base"
//                                             onFocus={() => {
//                                                 if (searchQuery.length >= 3) {
//                                                     setIsDropdownOpen(true);
//                                                 }
//                                             }}
//                                         />
//                                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
//                                         {isSearching && (
//                                             <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
//                                                 <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                 </svg>
//                                             </div>
//                                         )}
//                                     </div>
//                                     <Button 
//                                         className="ml-2 h-12" 
//                                         onClick={handleCheckPrice}
//                                     >
//                                         Check Price
//                                     </Button>
//                                 </div>

//                                 {isDropdownOpen && searchResults && searchResults.length > 0 && (
//                                     <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
//                                         <ul className="py-1">
//                                             {searchResults.map((location) => (
//                                                 <li
//                                                     key={location.id}
//                                                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
//                                                     onClick={() => handleLocationSelect(location)}
//                                                 >
//                                                     <MapPin size={16} className="mr-2 text-gray-500" />
//                                                     <div>
//                                                         <p className="font-medium">{location.name}</p>
//                                                         <p className="text-sm text-gray-500 truncate">{location.address}</p>
//                                                     </div>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex justify-center mt-4">
//                                 <Button 
//                                     variant="outline" 
//                                     className="flex items-center justify-center"
//                                     onClick={() => {
//                                         const accessToken = localStorage.getItem("accessToken");
//                                         if (accessToken) {
//                                             navigate("/rider/ride-booking");
//                                         } else {
//                                             navigate("/login", { 
//                                                 state: { 
//                                                     from: "/rider/ride-booking",
//                                                     useCurrentLocation: true
//                                                 }
//                                             });
//                                         }
//                                     }}
//                                 >
//                                     <MapPin className="mr-2" size={16} />
//                                     Use current location
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }