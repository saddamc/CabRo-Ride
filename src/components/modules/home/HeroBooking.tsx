import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLazySearchLocationsQuery, useRequestRideMutation, type ILocation, type ILocationSearchResult } from "@/redux/features/rides/ride.api";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronRight, MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate } from "react-router-dom";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function HeroBooking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ILocationSearchResult[]>([]);
  const [pickupLocation, setPickupLocation] = useState<ILocation | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<ILocation | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]); // Dhaka coordinates
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchLocations, { data: locationsData }] = useLazySearchLocationsQuery();
  const [requestRide, { isLoading: isRequestingRide }] = useRequestRideMutation();

  // Get current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords: [number, number] = [longitude, latitude];
          setCurrentLocation(coords);
          setMapCenter(coords);
          // Create a default location object for pickup
          setPickupLocation({
            coordinates: coords,
            address: "Current Location"
          });
        },
        (error) => {
          console.error('Error getting current location:', error);
          // Default to Dhaka if geolocation fails
          const defaultCoords: [number, number] = [90.4125, 23.8103];
          setCurrentLocation(defaultCoords);
          setMapCenter(defaultCoords);
          setPickupLocation({
            coordinates: defaultCoords,
            address: "Dhaka, Bangladesh"
          });
        }
      );
    } else {
      // Default to Dhaka if geolocation is not supported
      const defaultCoords: [number, number] = [90.4125, 23.8103];
      setCurrentLocation(defaultCoords);
      setMapCenter(defaultCoords);
      setPickupLocation({
        coordinates: defaultCoords,
        address: "Dhaka, Bangladesh"
      });
    }
  }, []);

  // Search for locations when query changes
  useEffect(() => {
    if (searchQuery.length >= 3) {
      searchLocations(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchLocations]);

  // Update search results
  useEffect(() => {
    if (locationsData) {
      setSearchResults(locationsData);
    }
  }, [locationsData]);

  // Calculate fare when both locations are selected
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      // Simple fare calculation: base fare + distance-based fare
      const baseFare = 50;
      const distanceKm = 5; // Default distance for demo
      const farePerKm = 15;
      const totalFare = baseFare + (distanceKm * farePerKm);
      const estimatedTime = Math.ceil(distanceKm * 2); // 2 minutes per km

      setEstimatedFare(totalFare);
      setEstimatedTime(estimatedTime);
    } else {
      setEstimatedFare(null);
      setEstimatedTime(null);
    }
  }, [pickupLocation, dropoffLocation]);

  const handleLocationSelect = (location: ILocation) => {
    setDropoffLocation(location);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleGoClick = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast({
        title: "Missing information",
        description: "Please select both pickup and destination locations",
        variant: "destructive",
      });
      return;
    }

    try {
      // Book the ride directly
      const rideRequestData = {
        pickupLocation: {
          address: pickupLocation.address,
          coordinates: pickupLocation.coordinates,
        },
        destinationLocation: {
          address: dropoffLocation.address,
          coordinates: dropoffLocation.coordinates,
        },
        notes: `Booked from hero section - Fare: ৳${estimatedFare}`,
      };

      await requestRide(rideRequestData).unwrap();

      toast({
        title: "Ride booked successfully!",
        description: "Finding available drivers for you...",
      });

      // Navigate to ride tracking page or dashboard
      navigate('/rider/dashboard');

    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Booking failed",
        description: "Could not book your ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Map Section */}
        <div className="h-48 relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {currentLocation && (
              <Marker position={currentLocation}>
                <Popup>You are here</Popup>
              </Marker>
            )}
            {dropoffLocation && (
              <Marker position={dropoffLocation.coordinates}>
                <Popup>Destination</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Booking Form */}
        <div className="p-6 space-y-4">
          {/* Pickup Location */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
              <MapPin size={16} />
            </div>
            <div className="flex-1">
              {pickupLocation ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Pickup</p>
                  <p className="font-medium truncate">{pickupLocation.address}</p>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Getting your location...</p>
                </div>
              )}
            </div>
          </div>

          {/* Destination Input */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white flex-shrink-0">
              <Navigation size={16} />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Where to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleLocationSelect({
                    address: location.address,
                    coordinates: location.coordinates
                  })}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium truncate">{location.name}</p>
                    <p className="text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              ))}
            </div>
          )}

          {/* Price Display */}
          {pickupLocation && dropoffLocation && estimatedFare && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Estimated fare</p>
                  <p className="text-2xl font-bold text-blue-900">৳{Math.round(estimatedFare)}</p>
                  {estimatedTime && (
                    <p className="text-sm text-blue-600">{Math.ceil(estimatedTime)} min away</p>
                  )}
                </div>
                <Button
                  onClick={handleGoClick}
                  size="lg"
                  className="px-8"
                  disabled={isRequestingRide}
                >
                  {isRequestingRide ? "Booking..." : "Go"}
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRequestingRide && (
            <div className="text-center py-4">
              <p className="text-gray-500">Booking your ride...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}