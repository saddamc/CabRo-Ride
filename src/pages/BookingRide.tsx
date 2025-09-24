import { useToast } from '@/components/ui/use-toast';
import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import type { IDriver, ILocation } from '@/redux/features/ride/ride.api';
import {
  useCalculateFareMutation,
  useGetNearbyDriversQuery,
  useRequestRideMutation
} from '@/redux/features/ride/ride.api';
import { reverseGeocode } from '@/services/mockLocationService';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import DriverStatus from '../components/RideBooking/DriverStatus';
import LocationSearch from '../components/RideBooking/LocationSearch';
import MapView from '../components/RideBooking/MapView';
import RideSelection from '../components/RideBooking/RideSelection';

// Booking phases enum
type BookingPhase =
  | 'search'
  | 'select_ride'
  | 'finding_driver'
  | 'driver_assigned'
  | 'in_progress'
  | 'completed';

export default function BookingRide() {
   // Router hooks
   const location = useLocation();
   const navigate = useNavigate();
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
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedRideType, setSelectedRideType] = useState('regular');
  const [rideDetails, setRideDetails] = useState<{
    fare: number;
    distance: number;
    estimatedTime: number;
  } | null>(null);
  const [matchedDriver, setMatchedDriver] = useState<IDriver | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]); // Dhaka
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Hooks
  const { toast } = useToast();
  const { data: userInfo } = useUserInfoQuery(undefined);

  // RTK Query hooks
  const [calculateFare] = useCalculateFareMutation();
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
  const [requestRideMutation, { isLoading: isRequestingRide }] = useRequestRideMutation();

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          const locationData = reverseGeocode(latitude, longitude);
          setPickupLocation(locationData);
          setPickupInput(locationData.name);
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
  }, [toast]);

  // Get current location for destination
  const getCurrentLocationForDestination = useCallback(async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;

          // Try to reverse geocode for better location name
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            const locationName = data.locality || data.city || data.principalSubdivision || 'Dhaka';
            const fullAddress = `${locationName}, Dhaka, Bangladesh`;

            const locationData: ILocation = {
              id: `current-dest-${Date.now()}`,
              name: locationName,
              address: fullAddress,
              coordinates: [longitude, latitude],
              type: 'current'
            };

            setDropoffLocation(locationData);
            setDestinationInput(locationName);
          } catch {
            // Fallback to mock reverse geocode
            const locationData = reverseGeocode(latitude, longitude);
            setDropoffLocation(locationData);
            setDestinationInput(locationData.name);
          }
        }, (error) => {
          toast({
            title: 'Geolocation error for destination',
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
  }, [toast]);

  // Effects
  useEffect(() => {
    // Handle hero booking state (from new Uber-like booking)
    if (heroBookingState?.pickupLocation || heroBookingState?.dropoffLocation) {
      if (heroBookingState.pickupLocation) {
        setPickupLocation(heroBookingState.pickupLocation);
        setPickupInput(heroBookingState.pickupLocation.name);
      }
      if (heroBookingState.dropoffLocation) {
        setDropoffLocation(heroBookingState.dropoffLocation);
        setDestinationInput(heroBookingState.dropoffLocation.name);
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

    // Handle current location request from home page
    if (location.state?.useCurrentLocation) {
      getCurrentLocation();
    }
  }, [heroBookingState, location.state?.useCurrentLocation, getCurrentLocation]);

  useEffect(() => {
    if (pickupLocation) {
      setMapCenter([pickupLocation.coordinates[1], pickupLocation.coordinates[0]]);
    }
  }, [pickupLocation]);

  // Calculate ride fare
  const calculateRideFare = async () => {
    if (!pickupLocation || !dropoffLocation) return;

    try {
      try {
        const result = await calculateFare({
          pickupLocation,
          dropoffLocation,
          rideType: selectedRideType,
        }).unwrap();

        setRideDetails(result);
      } catch (apiError) {
        console.error('API error calculating fare:', apiError);

        // Mock calculation
        const distance = calculateMockDistance(
          pickupLocation.coordinates[1],
          pickupLocation.coordinates[0],
          dropoffLocation.coordinates[1],
          dropoffLocation.coordinates[0]
        );

        const timeMinutes = (distance / 1000) * 2;
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

  // Helper function
  const calculateMockDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Event handlers
  const handlePickupInputChange = (value: string) => setPickupInput(value);
  const handleDestinationInputChange = (value: string) => setDestinationInput(value);

  const handlePickupSelect = (location: ILocation) => {
    setPickupLocation(location);
    setPickupInput(location.name);
  };

  const handleDestinationSelect = (location: ILocation) => {
    setDropoffLocation(location);
    setDestinationInput(location.name);
  };

  const handleSeeDetails = async () => {
    // Check if user is authenticated
    if (!userInfo?.data) {
      navigate('/login', { state: { from: '/booking-ride' } });
      return;
    }

    // Check if user is a driver
    if (userInfo.data.role === role.driver) {
      toast({
        title: 'Access Restricted',
        description: 'Drivers cannot book rides. This feature is only available for riders.',
        variant: 'destructive',
      });
      return;
    }

    await calculateRideFare();
    setBookingPhase('select_ride');
  };

  const handleRideTypeChange = (rideType: string) => {
    setSelectedRideType(rideType);
  };

  const handleToggleMap = () => setIsMapExpanded(!isMapExpanded);

  const handleRequestRide = async () => {
    // Additional role check for booking button
    if (userInfo?.data?.role === role.driver) {
      toast({
        title: 'Access Denied',
        description: 'Drivers cannot book rides.',
        variant: 'destructive',
      });
      return;
    }

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

      await requestRideMutation(rideRequestData).unwrap();

      toast({
        title: 'Ride requested successfully',
        description: 'Searching for available drivers...',
      });

      // Simulate driver matching
      setTimeout(() => {
        if (nearbyDrivers && nearbyDrivers.length > 0) {
          setMatchedDriver(nearbyDrivers[0]);
          setBookingPhase('driver_assigned');
          toast({
            title: 'Driver assigned',
            description: `${nearbyDrivers[0].name} is on the way!`,
          });
        } else {
          // Mock driver
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
        }

        setTimeout(() => {
          setBookingPhase('in_progress');
          toast({
            title: 'Ride started',
            description: 'Your ride is now in progress',
          });

          setTimeout(() => {
            setBookingPhase('completed');
            toast({
              title: 'Ride completed',
              description: 'Thank you for riding with us!',
            });
          }, 15000);
        }, 8000);
      }, 4000);

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
    setPickupInput('');
    setDestinationInput('');
    setBookingPhase('search');
    setRideDetails(null);
    setMatchedDriver(null);
    setIsMapExpanded(false);
  };

  const handleCancelRide = () => {
    handleReset();
  };

  const handleCompleteRide = () => {
    handleReset();
  };

  // Render content based on booking phase
  const renderContent = () => {
    switch (bookingPhase) {
      case 'search':
        return (
          <div className="flex h-full">
            {/* Left: Booking UI (40%) */}
            <div className="w-full md:w-2/5 flex flex-col bg-white h-full border-r">
              <LocationSearch
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                pickupInput={pickupInput}
                destinationInput={destinationInput}
                onPickupInputChange={handlePickupInputChange}
                onDestinationInputChange={handleDestinationInputChange}
                onPickupSelect={handlePickupSelect}
                onDestinationSelect={handleDestinationSelect}
                onGetCurrentLocation={(isPickup: boolean) => {
                  if (isPickup) {
                    getCurrentLocation();
                  } else {
                    getCurrentLocationForDestination();
                  }
                }}
                onSeeDetails={handleSeeDetails}
                showSeeDetails={pickupLocation !== null && dropoffLocation !== null}
                userRole={userInfo?.data?.role}
              />
            </div>
            {/* Right: Map (60%) - hidden in search phase */}
            <div className="hidden md:block w-3/5 h-full">
              {/* Map is hidden until 'See Details' is clicked */}
            </div>
          </div>
        );

      case 'select_ride':
        return (
          <div className="flex h-full">
            {/* Left: Booking UI (40%) */}
            <div id="booking-panel" className="md:w-2/5 flex flex-col bg-white h-full border-r">
              <LocationSearch
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                pickupInput={pickupInput}
                destinationInput={destinationInput}
                onPickupInputChange={handlePickupInputChange}
                onDestinationInputChange={handleDestinationInputChange}
                onPickupSelect={handlePickupSelect}
                onDestinationSelect={handleDestinationSelect}
                onGetCurrentLocation={(isPickup: boolean) => {
                  if (isPickup) {
                    getCurrentLocation();
                  } else {
                    getCurrentLocationForDestination();
                  }
                }}
                onSeeDetails={handleSeeDetails}
                showSeeDetails={false}
                userRole={userInfo?.data?.role}
              />
              <RideSelection
                selectedRideType={selectedRideType}
                rideDetails={rideDetails}
                isMapExpanded={isMapExpanded}
                onRideTypeChange={handleRideTypeChange}
                onCalculateFare={calculateRideFare}
                onToggleMap={handleToggleMap}
              />
              <div className="p-4 bg-white border-t">
                {userInfo?.data?.role === role.driver ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500 mb-2">
                      🚫 Drivers cannot book rides
                    </div>
                    <div className="text-sm text-gray-400">
                      This feature is only available for riders. You can still view routes and fares.
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={handleReset}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                      onClick={handleRequestRide}
                      disabled={isRequestingRide}
                    >
                      {isRequestingRide ? 'Requesting...' : `Book ${selectedRideType.charAt(0).toUpperCase() + selectedRideType.slice(1)}`}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Map (60%) */}
            <div className="hidden md:block w-3/5 h-full">
              <MapView
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                matchedDriver={matchedDriver}
                mapCenter={mapCenter}
                bookingPhase={bookingPhase}
                isExpanded={isMapExpanded}
              />
            </div>
          </div>
        );

      case 'finding_driver':
      case 'driver_assigned':
      case 'in_progress':
      case 'completed':
        return (
          <div className="flex flex-col h-full">
            <LocationSearch
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              pickupInput={pickupInput}
              destinationInput={destinationInput}
              onPickupInputChange={handlePickupInputChange}
              onDestinationInputChange={handleDestinationInputChange}
              onPickupSelect={handlePickupSelect}
              onDestinationSelect={handleDestinationSelect}
              onGetCurrentLocation={(isPickup: boolean) => {
                 if (isPickup) {
                   getCurrentLocation();
                 } else {
                   getCurrentLocationForDestination();
                 }
               }}
              onSeeDetails={handleSeeDetails}
              showSeeDetails={false}
              userRole={userInfo?.data?.role}
            />
            {isMapExpanded && (
              <MapView
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                matchedDriver={matchedDriver}
                mapCenter={mapCenter}
                bookingPhase={bookingPhase}
              />
            )}
            <DriverStatus
              bookingPhase={bookingPhase}
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              matchedDriver={matchedDriver}
              isMapExpanded={isMapExpanded}
              onToggleMap={handleToggleMap}
              onCancelRide={handleCancelRide}
              onCompleteRide={handleCompleteRide}
            />
            {bookingPhase !== 'completed' && (
              <div className="p-4 bg-white border-t">
                <button
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={handleCancelRide}
                >
                  Cancel Ride
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col h-full">
            <LocationSearch
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              pickupInput={pickupInput}
              destinationInput={destinationInput}
              onPickupInputChange={handlePickupInputChange}
              onDestinationInputChange={handleDestinationInputChange}
              onPickupSelect={handlePickupSelect}
              onDestinationSelect={handleDestinationSelect}
              onGetCurrentLocation={(isPickup: boolean) => {
                   if (isPickup) {
                     getCurrentLocation();
                   } else {
                     getCurrentLocationForDestination();
                   }
                 }}
              onSeeDetails={handleSeeDetails}
              showSeeDetails={pickupLocation !== null && dropoffLocation !== null}
              userRole={userInfo?.data?.role}
            />
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