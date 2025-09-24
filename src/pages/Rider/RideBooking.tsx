import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import useDebounce from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import type { IDriver, ILocation } from '@/redux/features/ride/ride.api';
import {
    useCalculateFareMutation,
    useGetNearbyDriversQuery,
    useRequestRideMutation
} from '@/redux/features/ride/ride.api';
// Import mock services to handle location searches locally (avoiding API errors)
import { reverseGeocode as mockReverseGeocode, searchLocations as mockSearchLocations } from '@/services/mockLocationService';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import { Car, Clock, DollarSign, MapPin, Navigation, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

// Define custom icon for markers
const createIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const pickupIcon = createIcon('/pickup-marker.png');
const dropoffIcon = createIcon('/dropoff-marker.png');
const driverIcon = createIcon('/driver-marker.png');

// Define ride types
const rideTypes = [
  { id: 'regular', name: 'Economy', price: '৳120', image: '/car-regular.png', multiplier: 1, time: '15 min' },
  { id: 'premium', name: 'Premium', price: '৳180', image: '/car-premium.png', multiplier: 1.5, time: '12 min' },
  { id: 'luxury', name: 'Luxury', price: '৳280', image: '/car-luxury.png', multiplier: 2.3, time: '10 min' },
];

// Routing component
function RoutingMachine({ pickup, dropoff }: { pickup: ILocation | null; dropoff: ILocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (pickup && dropoff) {
      // Clean up any existing polylines first
      map.eachLayer((layer) => {
        if (layer instanceof L.Polyline && !layer.options.fill) {
          map.removeLayer(layer);
        }
      });

      // Create a simple polyline route
      const polyline = L.polyline(
        [
          [pickup.coordinates[1], pickup.coordinates[0]],
          [dropoff.coordinates[1], dropoff.coordinates[0]]
        ],
        {
          color: '#6366f1',
          opacity: 0.8,
          weight: 6,
          dashArray: '10, 10'
        }
      ).addTo(map);

      // Fit the map to show both pickup and dropoff points with padding
      const bounds = L.latLngBounds(
        [pickup.coordinates[1], pickup.coordinates[0]],
        [dropoff.coordinates[1], dropoff.coordinates[0]]
      );
      map.fitBounds(bounds, { padding: [50, 50] });

      return () => {
        if (polyline) {
          map.removeLayer(polyline);
        }
      };
    }
  }, [map, pickup, dropoff]);

  return null;
}

// Center map component
function MapCenter({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);
  
  return null;
}

// Booking phases enum
type BookingPhase = 
  | 'search'
  | 'select_ride'
  | 'confirming'
  | 'finding_driver'
  | 'driver_assigned'
  | 'in_progress'
  | 'completed';

export default function RideBooking() {
  // Router hooks
  const location = useLocation();
  const selectedLocationFromHome = location.state?.selectedLocation as ILocation | undefined;
  const heroBookingState = location.state as {
    pickupLocation?: ILocation;
    dropoffLocation?: ILocation;
    estimatedFare?: number;
    estimatedTime?: number;
  } | null;
  
  // State variables
  const [bookingPhase, setBookingPhase] = useState<BookingPhase>('search');
  const [pickupLocation, setPickupLocation] = useState<ILocation | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<ILocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ILocation[]>([]);
  const [selectedLocationType, setSelectedLocationType] = useState<'pickup' | 'dropoff'>('pickup');
  const [selectedRideType, setSelectedRideType] = useState('regular');
  const [rideDetails, setRideDetails] = useState<{
    fare: number;
    distance: number;
    estimatedTime: number;
  } | null>(null);
  const [matchedDriver, setMatchedDriver] = useState<IDriver | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]); // Dhaka
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const debouncedSearchTerm = useDebounce(searchQuery, 500);
  const { toast } = useToast();

  // State for mock API handling
  const [isSearching, setIsSearching] = useState(false);
  
  // RTK Query hooks
  const [calculateFare, { isLoading: isCalculating }] = useCalculateFareMutation();
  const { data: nearbyDrivers } = useGetNearbyDriversQuery(
    pickupLocation ?
    {
      lat: pickupLocation.coordinates[1],
      lng: pickupLocation.coordinates[0],
      rideType: selectedRideType
    } :
    { lat: 0, lng: 0 },
    { skip: !pickupLocation || bookingPhase !== 'finding_driver' }
  );

  // Handlers
  const getCurrentLocation = useCallback(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          
          // Update map center
          setMapCenter([latitude, longitude]);
          
          // Get address from coordinates using mock service
          const locationData = mockReverseGeocode(latitude, longitude);
          
          if (selectedLocationType === 'pickup') {
            setPickupLocation(locationData);
          } else {
            setDropoffLocation(locationData);
          }
          
          // Clear search
          setSearchQuery('');
          setSearchResults([]);
        }, (error) => {
          toast({
            title: 'Geolocation error',
            description: error.message,
            variant: 'destructive',
          });
        });
      } else {
        toast({
          title: 'Geolocation not supported',
          description: 'Your browser does not support geolocation',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error getting location',
        description: 'Could not determine your current location',
        variant: 'destructive',
      });
    }
  }, [selectedLocationType, toast]);

  // Effects
  // Use location from home page or hero booking if available
  useEffect(() => {
    // Handle hero booking state (from new Uber-like booking)
    if (heroBookingState?.pickupLocation || heroBookingState?.dropoffLocation) {
      if (heroBookingState.pickupLocation) {
        setPickupLocation(heroBookingState.pickupLocation);
      }
      if (heroBookingState.dropoffLocation) {
        setDropoffLocation(heroBookingState.dropoffLocation);
      }
      if (heroBookingState.estimatedFare && heroBookingState.estimatedTime) {
        setRideDetails({
          fare: heroBookingState.estimatedFare,
          distance: 0, // We'll calculate this if needed
          estimatedTime: heroBookingState.estimatedTime,
        });
      }
      setBookingPhase('select_ride');
      return;
    }

    // Handle location selected from home page (legacy)
    if (selectedLocationFromHome) {
      if (selectedLocationType === 'pickup') {
        setPickupLocation(selectedLocationFromHome);
        setSelectedLocationType('dropoff');
      } else {
        setDropoffLocation(selectedLocationFromHome);
      }
    }

    // Handle current location request from home page
    if (location.state?.useCurrentLocation) {
      getCurrentLocation();
    }
  }, [heroBookingState, selectedLocationFromHome, selectedLocationType, location.state?.useCurrentLocation, getCurrentLocation]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      setIsSearching(true);
      // Use mock search instead of API
      const results = mockSearchLocations(debouncedSearchTerm);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);
  
  // For testing - populate with mock data if no real data
  useEffect(() => {
    // Only use mock data if no real data received after searching
    if (debouncedSearchTerm.length >= 3 && !isSearching && searchResults.length === 0) {
      const mockLocations: ILocation[] = [
        {
          id: 'mock-1',
          name: 'Dhaka City Center',
          address: 'Central Dhaka, Bangladesh',
          coordinates: [90.4125, 23.8103] as [number, number],
          type: 'city'
        },
        {
          id: 'mock-2',
          name: 'Gulshan Avenue',
          address: 'Gulshan, Dhaka, Bangladesh',
          coordinates: [90.4152, 23.7925] as [number, number],
          type: 'street'
        },
        {
          id: 'mock-3',
          name: `${debouncedSearchTerm} Plaza`,
          address: `Near ${debouncedSearchTerm}, Dhaka, Bangladesh`,
          coordinates: [90.3765, 23.7551] as [number, number],
          type: 'building'
        }
      ];
      
      setSearchResults(mockLocations);
    }
  }, [debouncedSearchTerm, isSearching, searchResults.length]);

  useEffect(() => {
    if (pickupLocation) {
      setMapCenter([pickupLocation.coordinates[1], pickupLocation.coordinates[0]]);
    }
  }, [pickupLocation]);

  const handleLocationSelect = (location: ILocation) => {
    if (selectedLocationType === 'pickup') {
      setPickupLocation(location);
      // If dropoff is not selected, switch to dropoff
      if (!dropoffLocation) {
        setSelectedLocationType('dropoff');
        if (searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
      }
    } else {
      setDropoffLocation(location);
    }
    
    setSearchQuery('');
    setSearchResults([]);
    
    // If both locations are set, calculate fare
    if (
      (selectedLocationType === 'pickup' && dropoffLocation) ||
      (selectedLocationType === 'dropoff' && pickupLocation)
    ) {
      calculateRideFare();
      setBookingPhase('select_ride');
    }
  };

  const calculateRideFare = async () => {
    if (!pickupLocation || !dropoffLocation) return;
    
    try {
      // Try to use the API first
      try {
        const result = await calculateFare({
          pickupLocation,
          dropoffLocation,
          rideType: selectedRideType,
        }).unwrap();
        
        setRideDetails(result);
      } catch (apiError) {
        console.error('API error calculating fare:', apiError);
        
        // If API fails, use a mock calculation instead
        const distance = calculateMockDistance(
          pickupLocation.coordinates[1], 
          pickupLocation.coordinates[0], 
          dropoffLocation.coordinates[1], 
          dropoffLocation.coordinates[0]
        );
        
        // Estimate time based on average speed of 30 km/h
        const timeMinutes = (distance / 1000) * 2; // 2 minutes per km
        
        // Base fare 50, then 30 per km
        const baseFare = 50;
        const farePerKm = 30;
        const fare = baseFare + (distance / 1000) * farePerKm;
        
        setRideDetails({
          fare,
          distance,
          estimatedTime: timeMinutes
        });
        
        toast({
          title: 'Using estimated fare',
          description: 'The fare is an estimate as we could not connect to the server',
        });
      }
    } catch (error) {
      console.error('Error in fare calculation:', error);
      toast({
        title: 'Error calculating fare',
        description: 'Could not calculate fare for this route',
        variant: 'destructive',
      });
    }
  };
  
  // Helper function to calculate distance between coordinates using Haversine formula
  const calculateMockDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // RTK Query hooks
  const [requestRideMutation, { isLoading: isRequestingRide }] = useRequestRideMutation();

  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation || !rideDetails) {
      toast({
        title: 'Missing information',
        description: 'Please select both pickup and dropoff locations',
        variant: 'destructive',
      });
      return;
    }

    try {
      setBookingPhase('finding_driver');

      // Create ride request data with all required fields
      const rideRequestData = {
        pickupLocation: {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates,
        },
        destinationLocation: {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates,
        },
        notes: `Ride type: ${selectedRideType}`,
      };

      // Call API to create ride in database
      await requestRideMutation(rideRequestData).unwrap();

      toast({
        title: 'Ride requested successfully',
        description: 'Searching for available drivers...',
      });

      // Store the ride ID for status tracking

      // Simulate driver matching and status progression
      // In a real app, this would be handled by WebSocket or polling to the backend
      setTimeout(() => {
        if (nearbyDrivers && nearbyDrivers.length > 0) {
          setMatchedDriver(nearbyDrivers[0]);
          setBookingPhase('driver_assigned');
          toast({
            title: 'Driver assigned',
            description: `${nearbyDrivers[0].name} is on the way!`,
          });

          // Simulate driver arriving and ride progress
          setTimeout(() => {
            setBookingPhase('in_progress');
            toast({
              title: 'Ride started',
              description: 'Your ride is now in progress',
            });

            // Simulate ride completion
            setTimeout(() => {
              setBookingPhase('completed');
              toast({
                title: 'Ride completed',
                description: 'Thank you for riding with us!',
              });
            }, 15000); // Ride duration: 15 seconds

          }, 8000); // Time to reach passenger: 8 seconds

        } else {
          // Create mock driver
          const mockDriver = {
            id: 'mock-driver-1',
            name: 'Karim Ahmed',
            rating: 4.8,
            profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
            vehicleInfo: {
              make: 'Toyota',
              model: 'Corolla',
              year: '2020',
              color: 'Silver',
              licensePlate: 'DHK-1234'
            },
            currentLocation: {
              coordinates: [
                pickupLocation.coordinates[0] + (Math.random() * 0.01 - 0.005),
                pickupLocation.coordinates[1] + (Math.random() * 0.01 - 0.005)
              ] as [number, number],
            },
            estimatedArrival: 5
          };

          setMatchedDriver(mockDriver);
          setBookingPhase('driver_assigned');

          toast({
            title: 'Driver assigned',
            description: `${mockDriver.name} is on the way!`,
          });

          // Simulate driver arriving and ride progress
          setTimeout(() => {
            setBookingPhase('in_progress');
            toast({
              title: 'Ride started',
              description: 'Your ride is now in progress',
            });

            // Simulate ride completion
            setTimeout(() => {
              setBookingPhase('completed');
              toast({
                title: 'Ride completed',
                description: 'Thank you for riding with us!',
              });
            }, 15000);
          }, 8000);
        }
      }, 4000); // Driver search time: 4 seconds

    } catch (error) {
      console.error('Error requesting ride:', error);
      toast({
        title: 'Error requesting ride',
        description: 'Could not request a ride at this time. Please try again.',
        variant: 'destructive',
      });
      setBookingPhase('select_ride');
    }
  };

  const handleReset = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLocationType('pickup');
    setBookingPhase('search');
    setRideDetails(null);
    setMatchedDriver(null);
    setIsMapExpanded(false);
  };

  const handleExpandMap = () => {
    setIsMapExpanded(!isMapExpanded);
  };

  // Render functions
  const renderSearchBar = () => (
    <div className="p-4 bg-white border-b sticky top-0 z-10">
      {/* Pickup location */}
      <div className="flex items-center mb-3">
        <div className="w-10 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <MapPin size={16} />
          </div>
        </div>
        <div 
          className={cn(
            "flex-grow p-2 border rounded-lg cursor-pointer hover:bg-gray-50",
            selectedLocationType === "pickup" && "border-blue-500 bg-blue-50"
          )}
          onClick={() => {
            setSelectedLocationType('pickup');
            setSearchQuery('');
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }}
        >
          {pickupLocation ? (
            <div className="flex justify-between items-center">
              <span className="font-medium truncate">{pickupLocation.name}</span>
              <X 
                className="text-gray-500 cursor-pointer" 
                size={16} 
                onClick={(e) => {
                  e.stopPropagation();
                  setPickupLocation(null);
                  setBookingPhase('search');
                }} 
              />
            </div>
          ) : (
            <span className="text-gray-500">Enter pickup location</span>
          )}
        </div>
      </div>
      
      {/* Dropoff location */}
      <div className="flex items-center">
        <div className="w-10 flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            <Navigation size={16} />
          </div>
        </div>
        <div 
          className={cn(
            "flex-grow p-2 border rounded-lg cursor-pointer hover:bg-gray-50",
            selectedLocationType === "dropoff" && "border-red-500 bg-red-50"
          )}
          onClick={() => {
            setSelectedLocationType('dropoff');
            setSearchQuery('');
            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }}
        >
          {dropoffLocation ? (
            <div className="flex justify-between items-center">
              <span className="font-medium truncate">{dropoffLocation.name}</span>
              <X 
                className="text-gray-500 cursor-pointer" 
                size={16} 
                onClick={(e) => {
                  e.stopPropagation();
                  setDropoffLocation(null);
                  setBookingPhase('search');
                }} 
              />
            </div>
          ) : (
            <span className="text-gray-500">Enter destination</span>
          )}
        </div>
      </div>
      
      {/* Search input - shown when selecting location */}
      {bookingPhase === 'search' && (
        <div className="mt-4">
          <div className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={`Search for ${selectedLocationType === "pickup" ? "pickup" : "destination"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full mt-2 flex items-center justify-center"
            onClick={getCurrentLocation}
          >
            <MapPin className="mr-2" size={16} />
            Use current location
          </Button>
        </div>
      )}
    </div>
  );

  const renderSearchResults = () => (
    <div className="flex-1 overflow-y-auto p-2 bg-white">
      <h3 className="text-sm font-medium px-2 py-1 text-gray-500">SUGGESTIONS</h3>
      {searchResults.length > 0 ? (
        <ul className="divide-y">
          {searchResults.map((location) => (
            <li
              key={location.id}
              className="px-2 py-3 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleLocationSelect(location)}
            >
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3 mt-1">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-gray-500 truncate">{location.address}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        debouncedSearchTerm.length >= 3 && !isSearching && (
          <div className="text-center py-4 text-gray-500">
            No locations found. Try a different search term.
          </div>
        )
      )}
    </div>
  );

  const renderRideSelection = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Choose your ride</h2>
          <Button variant="ghost" size="sm" onClick={handleExpandMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
        
        {/* Ride details */}
        {rideDetails && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{Math.ceil(rideDetails.estimatedTime)} min</span>
            </div>
            <div>
              {(rideDetails.distance / 1000).toFixed(1)} km
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="mr-1" />
              <span>৳{Math.round(rideDetails.fare)}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Ride types */}
      <div className="p-4">
        <div className="space-y-3">
          {rideTypes.map((ride) => (
            <div
              key={ride.id}
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-all",
                selectedRideType === ride.id 
                  ? "border-blue-500 bg-blue-50 shadow-sm" 
                  : "hover:bg-gray-50"
              )}
              onClick={() => {
                setSelectedRideType(ride.id);
                calculateRideFare();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mr-3 overflow-hidden flex items-center justify-center">
                    <Car size={24} />
                  </div>
                  <div>
                    <p className="font-medium">{ride.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{ride.time}</span>
                      <span>•</span>
                      <span className="font-medium">
                        {rideDetails 
                          ? `৳${Math.round(rideDetails.fare * ride.multiplier)}` 
                          : ride.price}
                      </span>
                    </div>
                  </div>
                </div>
                <input 
                  type="radio" 
                  checked={selectedRideType === ride.id}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-500" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFindingDriver = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
        <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2 text-center">Finding your driver</h2>
      <p className="text-gray-500 text-center mb-6">
        Please wait while we connect you with a nearby driver...
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-blue-600 h-2 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
      </div>
      <p className="text-sm text-gray-500">This usually takes less than 60 seconds</p>
      <Button variant="outline" className="mt-8" onClick={handleReset}>
        Cancel
      </Button>
    </div>
  );

  const renderDriverAssigned = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your driver is coming</h2>
          <Button variant="ghost" size="sm" onClick={handleExpandMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 bg-gray-100 rounded-full mr-4 overflow-hidden">
            {matchedDriver?.profileImage ? (
              <img 
                src={matchedDriver.profileImage} 
                alt={matchedDriver.name} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl font-bold">
                {matchedDriver?.name?.charAt(0) || 'D'}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{matchedDriver?.name}</h3>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="mr-2">{matchedDriver?.rating}</span>
              <span className="text-gray-500">
                {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {matchedDriver?.vehicleInfo?.color} • {matchedDriver?.vehicleInfo?.licensePlate}
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg flex items-center mb-4">
          <Clock className="text-blue-600 mr-3" size={20} />
          <div>
            <p className="text-sm text-blue-700">Arriving in</p>
            <p className="font-bold">{matchedDriver?.estimatedArrival || 5} minutes</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" className="flex-1 mr-2">Call Driver</Button>
          <Button variant="outline" className="flex-1">Message</Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium mb-3">Trip details</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{pickupLocation?.name}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Navigation size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{dropoffLocation?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInProgress = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Ride in progress</h2>
          <Button variant="ghost" size="sm" onClick={handleExpandMap}>
            {isMapExpanded ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold">On the way to destination</p>
              <p className="text-sm text-green-700">Enjoy your ride!</p>
            </div>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ride details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Driver</span>
                <span className="font-medium">{matchedDriver?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">
                  {matchedDriver?.vehicleInfo?.make} {matchedDriver?.vehicleInfo?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated arrival</span>
                <span className="font-medium">
                  {rideDetails ? Math.ceil(rideDetails.estimatedTime) + " min" : "15 min"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total fare</span>
                <span className="font-medium">
                  ৳{rideDetails 
                    ? Math.round(rideDetails.fare * (selectedRideType === "regular" 
                      ? 1 
                      : selectedRideType === "premium" 
                        ? 1.5 
                        : 2.3))
                    : "350"}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-between">
              <Button variant="outline" className="flex-1 mr-2">Call Driver</Button>
              <Button variant="outline" className="flex-1">Message</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MapPin size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup</p>
              <p className="font-medium">{pickupLocation?.name}</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-10 flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Navigation size={16} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Destination</p>
              <p className="font-medium">{dropoffLocation?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Ride Completed</h2>
        <p className="text-gray-500 mb-6">Thanks for riding with us!</p>
        
        <Card className="mb-6 text-left">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Pickup</span>
                <span className="font-medium">{pickupLocation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dropoff</span>
                <span className="font-medium">{dropoffLocation?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Distance</span>
                <span className="font-medium">
                  {rideDetails ? (rideDetails.distance / 1000).toFixed(1) + " km" : "3.2 km"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">
                  {rideDetails ? Math.ceil(rideDetails.estimatedTime) + " min" : "15 min"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ride type</span>
                <span className="font-medium capitalize">{selectedRideType}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total fare</span>
                <span>
                  ৳{rideDetails 
                    ? Math.round(rideDetails.fare * (selectedRideType === "regular" 
                      ? 1 
                      : selectedRideType === "premium" 
                        ? 1.5 
                        : 2.3))
                    : "350"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Rate your trip</h3>
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="text-2xl text-yellow-400">★</button>
            ))}
          </div>
          <Input
            placeholder="Add a comment (optional)"
            className="mb-4"
          />
        </div>
        
        <Button className="w-full" onClick={handleReset}>
          Done
        </Button>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className={cn(
      "transition-all duration-300 ease-in-out bg-white",
      isMapExpanded ? "flex-grow" : "h-64"
    )}>
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapCenter position={mapCenter} />
        
        {pickupLocation && (
          <Marker 
            position={[pickupLocation.coordinates[1], pickupLocation.coordinates[0]]} 
            icon={pickupIcon}
          >
            <Popup>Pickup: {pickupLocation.name}</Popup>
          </Marker>
        )}
        
        {dropoffLocation && (
          <Marker 
            position={[dropoffLocation.coordinates[1], dropoffLocation.coordinates[0]]} 
            icon={dropoffIcon}
          >
            <Popup>Dropoff: {dropoffLocation.name}</Popup>
          </Marker>
        )}
        
        {matchedDriver && bookingPhase !== 'completed' && (
          <Marker 
            position={[
              matchedDriver.currentLocation.coordinates[1], 
              matchedDriver.currentLocation.coordinates[0]
            ]} 
            icon={driverIcon}
          >
            <Popup>{matchedDriver.name}'s car</Popup>
          </Marker>
        )}
        
        {pickupLocation && dropoffLocation && (
          <RoutingMachine pickup={pickupLocation} dropoff={dropoffLocation} />
        )}
      </MapContainer>
    </div>
  );

  const renderContent = () => {
    switch (bookingPhase) {
      case 'search':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {renderSearchResults()}
          </div>
        );
      case 'select_ride':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {renderMap()}
            {renderRideSelection()}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleRequestRide}
                  disabled={isRequestingRide || isCalculating}
                >
                  {isRequestingRide ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Requesting
                    </>
                  ) : (
                    `Book ${selectedRideType.charAt(0).toUpperCase() + selectedRideType.slice(1)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
      case 'finding_driver':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {renderFindingDriver()}
          </div>
        );
      case 'driver_assigned':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {isMapExpanded && renderMap()}
            {renderDriverAssigned()}
            <div className="p-4 bg-white border-t">
              <Button variant="outline" className="w-full" onClick={handleReset}>
                Cancel Ride
              </Button>
            </div>
          </div>
        );
      case 'in_progress':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {isMapExpanded && renderMap()}
            {renderInProgress()}
          </div>
        );
      case 'completed':
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {renderCompleted()}
          </div>
        );
      default:
        return (
          <div className="flex flex-col h-full">
            {renderSearchBar()}
            {renderSearchResults()}
          </div>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-100">
      {renderContent()}
    </div>
  );
}