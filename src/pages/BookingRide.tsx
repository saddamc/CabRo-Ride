import { useToast } from '@/components/ui/use-toast';
import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import type { IDriver, ILocation } from '@/redux/features/ride/ride.api';
import {
  useCalculateFareMutation
} from '@/redux/features/ride/ride.api';
import {
  useGetActiveRideQuery,
  useRequestRideMutation
} from '@/redux/features/rides/ride.api';
import { reverseGeocode } from '@/services/mockLocationService';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Navbar from '@/components/layout/common/Navbar';
import CancelRideHandler from '../components/RideBooking/CancelRideHandler';
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
    const { rideId: urlRideId } = useParams<{ rideId?: string }>();
    // Used to check if we're on a ride-specific URL
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
  const [currentRideId, setCurrentRideId] = useState<string | null>(null);

  // Hooks
  const { toast } = useToast();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { data: activeRide, isLoading: isLoadingActiveRide } = useGetActiveRideQuery();
  // TODO: Add logic to handle direct navigation to ride URLs
  // const { data: urlRide, isLoading: isLoadingUrlRide } = useGetRideByIdQuery(urlRideId || '', {
  //   skip: !urlRideId
  // });

  // RTK Query hooks
  const [calculateFare] = useCalculateFareMutation();
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
    // If we're on a ride-specific URL, skip the search phase
    if (urlRideId) {
      console.log('On ride-specific URL:', urlRideId, '- setting phase to finding_driver');
      setBookingPhase('finding_driver');
      return;
    }

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
  }, [heroBookingState, location.state?.useCurrentLocation, getCurrentLocation, urlRideId]);

  useEffect(() => {
    if (pickupLocation) {
      setMapCenter([pickupLocation.coordinates[1], pickupLocation.coordinates[0]]);
    }
  }, [pickupLocation]);

  // Check for active rides and restore state on component mount
  useEffect(() => {
    if (activeRide && !isLoadingActiveRide && bookingPhase === 'search') {
      console.log('Active ride found:', activeRide);

      // If we're on the base booking-ride route but have an active ride
      if (!urlRideId) {
        // For requested rides, show "Finding Driver" on base route
        if (activeRide.status === 'requested') {
          console.log('Showing "Finding Driver" for requested ride on base route');
          // Don't redirect, just set up the state for showing finding driver
          setCurrentRideId(activeRide._id);
          setPickupLocation({
            id: 'pickup',
            name: activeRide.pickupLocation.address,
            address: activeRide.pickupLocation.address,
            coordinates: activeRide.pickupLocation.coordinates,
            type: 'saved'
          });
          setPickupInput(activeRide.pickupLocation.address);

          setDropoffLocation({
            id: 'dropoff',
            name: activeRide.destinationLocation.address,
            address: activeRide.destinationLocation.address,
            coordinates: activeRide.destinationLocation.coordinates,
            type: 'saved'
          });
          setDestinationInput(activeRide.destinationLocation.address);

          if (activeRide.fare) {
            setRideDetails({
              fare: activeRide.fare.totalFare,
              distance: activeRide.distance?.estimated || 0,
              estimatedTime: activeRide.distance?.estimated ? (activeRide.distance.estimated / 1000) * 2 : 0
            });
          }

          setBookingPhase('finding_driver');
          return;
        } else {
          // For accepted/in_progress rides, redirect to specific ride URL
          console.log('Redirecting to ride-specific URL:', activeRide._id);
          navigate(`/booking-ride/${activeRide._id}`, { replace: true });
          return;
        }
      }

      // Restore ride state from active ride
      setCurrentRideId(activeRide._id);

      // Set locations from active ride
      setPickupLocation({
        id: 'pickup',
        name: activeRide.pickupLocation.address,
        address: activeRide.pickupLocation.address,
        coordinates: activeRide.pickupLocation.coordinates,
        type: 'saved'
      });
      setPickupInput(activeRide.pickupLocation.address);

      setDropoffLocation({
        id: 'dropoff',
        name: activeRide.destinationLocation.address,
        address: activeRide.destinationLocation.address,
        coordinates: activeRide.destinationLocation.coordinates,
        type: 'saved'
      });
      setDestinationInput(activeRide.destinationLocation.address);

      // Set ride details if available
      if (activeRide.fare) {
        setRideDetails({
          fare: activeRide.fare.totalFare,
          distance: activeRide.distance?.estimated || 0,
          estimatedTime: activeRide.distance?.estimated ? (activeRide.distance.estimated / 1000) * 2 : 0
        });
      }

      // Set matched driver if available
      if (activeRide.driver) {
        setMatchedDriver({
          id: activeRide.driver._id,
          name: activeRide.driver.user.name,
          rating: activeRide.driver.rating || 4.5,
          profileImage: activeRide.driver.user.profilePicture || 'https://randomuser.me/api/portraits/men/32.jpg',
          vehicleInfo: {
            make: activeRide.driver.vehicle?.make || 'Toyota',
            model: activeRide.driver.vehicle?.model || 'Corolla',
            year: activeRide.driver.vehicle?.year || '2020',
            color: activeRide.driver.vehicle?.color || 'Silver',
            licensePlate: activeRide.driver.vehicle?.licensePlate || 'DHK-1234'
          },
          currentLocation: {
            coordinates: [90.4125, 23.8103] // Default coordinates for demo
          },
          estimatedArrival: 5
        });
      }

      // Set appropriate booking phase based on ride status
      const statusToPhase: { [key: string]: BookingPhase } = {
        'requested': 'finding_driver',
        'accepted': 'driver_assigned',
        'in_transit': 'in_progress',
        'completed': 'completed',
        'cancelled': 'search'
      };

      const phase = statusToPhase[activeRide.status] || 'finding_driver';
      setBookingPhase(phase);
    }
  }, [activeRide, isLoadingActiveRide, bookingPhase]);

  // Calculate fare when entering select_ride phase with locations
  useEffect(() => {
    const calculate = async () => {
      if (bookingPhase === 'select_ride' && pickupLocation && dropoffLocation && !rideDetails) {
        await calculateRideFare();
      }
    };
    calculate();
  }, [bookingPhase, pickupLocation, dropoffLocation, rideDetails]);

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

        // Mock calculation using regular ride pricing
        const distance = calculateMockDistance(
          pickupLocation.coordinates[1],
          pickupLocation.coordinates[0],
          dropoffLocation.coordinates[1],
          dropoffLocation.coordinates[0]
        );

        const timeMinutes = (distance / 1000) * 2;
        const baseFare = 150; // Regular ride base price
        const farePerKm = 50; // Regular ride per km price
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

    // Check if user is a driver, admin, or super_admin
    if (userInfo.data.role === role.driver || userInfo.data.role === role.admin || userInfo.data.role === role.super_admin) {
      toast({
        title: 'Access Restricted',
        description: 'Drivers, admins, and super admins cannot book rides. This feature is only available for regular users.',
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
    if (userInfo?.data?.role === role.driver || userInfo?.data?.role === role.admin || userInfo?.data?.role === role.super_admin) {
      toast({
        title: 'Access Denied',
        description: 'Drivers, admins, and super admins cannot book rides.',
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

      const rideResponse = await requestRideMutation(rideRequestData).unwrap();
      setCurrentRideId(rideResponse._id);

      toast({
        title: 'Ride Request Send',
        description: 'Waiting for driver...',
      });

      // Navigate to the ride-specific URL
      navigate(`/booking-ride/${rideResponse._id}`);

      // Keep finding driver - wait for real driver acceptance
      // The ride status will be updated via API polling or WebSocket
      // For now, keep in finding_driver phase until driver accepts

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
    setCurrentRideId(null);
  };


  const handleCompleteRide = () => {
    handleReset();
  };

  // Render ride status bar (shown after ride request)
  const renderRideStatusBar = () => {
    // Don't show status bar for finding_driver on base route (show full DriverStatus instead)
    if ((bookingPhase === 'search' || bookingPhase === 'select_ride') && !urlRideId) {
      return null;
    }
    if (bookingPhase === 'finding_driver' && !urlRideId) {
      return null;
    }

    const getStatusText = () => {
      switch (bookingPhase) {
        case 'finding_driver':
          return 'Finding driver...';
        case 'driver_assigned':
          return 'Driver assigned - on the way!';
        case 'in_progress':
          return 'Ride in progress';
        case 'completed':
          return 'Ride completed';
        default:
          return 'Ride requested';
      }
    };

    const getStatusColor = () => {
      switch (bookingPhase) {
        case 'finding_driver':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'driver_assigned':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'in_progress':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'completed':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      }
    };

    return (
      <div className={`${getStatusColor()} border px-4 py-2 mb-4 rounded-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          {pickupLocation && dropoffLocation && (
            <div className="text-xs opacity-75">
              {pickupLocation.name} → {dropoffLocation.name}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render content based on booking phase
  const renderContent = () => {
    switch (bookingPhase) {
      case 'search':
        return (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left: Booking UI */}
            <div className="w-full lg:w-2/5 flex flex-col bg-white border-b lg:border-b-0 lg:border-r">
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
                userRole={userInfo?.data?.role}
              />
            </div>
            {/* Right: Map - Show preview on larger screens */}
            <div className="hidden lg:block lg:w-3/5 h-full">
              <MapView
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                matchedDriver={matchedDriver}
                mapCenter={mapCenter}
                bookingPhase={bookingPhase}
                isExpanded={false}
              />
            </div>
          </div>
        );

      case 'select_ride':
        return (
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left: Booking UI */}
            <div id="booking-panel" className="w-full lg:w-2/5 flex flex-col bg-white border-b lg:border-b-0 lg:border-r">
              {/* Hide LocationSearch when there's an active ride or we're on a ride-specific URL */}
              {(!activeRide && !urlRideId) && (
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
                  userRole={userInfo?.data?.role}
                />
              )}
              <RideSelection
                 selectedRideType={selectedRideType}
                 rideDetails={rideDetails}
                 isMapExpanded={isMapExpanded}
                 onRideTypeChange={handleRideTypeChange}
                 onToggleMap={handleToggleMap}
               />
              <div className="p-4 bg-white border-t">
                {(userInfo?.data?.role === role.driver || userInfo?.data?.role === role.admin || userInfo?.data?.role === role.super_admin) ? (
                  <div className="text-center py-4">
                    <div className="text-gray-500 mb-2">
                      🚫 {userInfo?.data?.role === role.driver ? 'Drivers' : userInfo?.data?.role === role.admin ? 'Admins' : 'Super Admins'} cannot book rides
                    </div>
                    <div className="text-sm text-gray-400">
                      This feature is only available for regular users. You can still view routes and fares.
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

            {/* Right: Map - Visible on all screen sizes */}
            <div className="flex-1 min-h-[400px] lg:h-full">
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
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left side: Driver status and ride info */}
            <div className="w-full lg:w-2/5 flex flex-col bg-white border-b lg:border-b-0 lg:border-r">
              {renderRideStatusBar()}
              {/* Hide LocationSearch when there's an active ride or we're on a ride-specific URL */}
              {(!activeRide && !urlRideId) && (
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
                  userRole={userInfo?.data?.role}
                />
              )}
              <DriverStatus
                bookingPhase={bookingPhase}
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                matchedDriver={matchedDriver}
                isMapExpanded={isMapExpanded}
                onToggleMap={handleToggleMap}
                onCancelRide={handleReset}
                onCompleteRide={handleCompleteRide}
              />
              {(bookingPhase === 'finding_driver' || bookingPhase === 'driver_assigned' || bookingPhase === 'in_progress') && currentRideId && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="text-center mb-2">
                    <span className="text-xs text-gray-500">Need to cancel your ride?</span>
                  </div>
                  <CancelRideHandler
                    rideId={currentRideId}
                    currentStatus={bookingPhase === 'finding_driver' ? 'requested' : bookingPhase === 'driver_assigned' ? 'accepted' : 'in_progress'}
                    onCancelSuccess={handleReset}
                  />
                </div>
              )}
            </div>

            {/* Right side: Map */}
            <div className="hidden lg:block lg:w-3/5 h-full">
              <MapView
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                matchedDriver={matchedDriver}
                mapCenter={mapCenter}
                bookingPhase={bookingPhase}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col h-full">
            {/* Hide LocationSearch when there's an active ride or we're on a ride-specific URL */}
            {(!activeRide && !urlRideId) && (
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
                userRole={userInfo?.data?.role}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="h-[calc(100vh-64px)] max-h-screen max-w-[1536px] mx-auto px-4 lg:px-6">
        {renderContent()}
      </div>
    </div>
  );
}