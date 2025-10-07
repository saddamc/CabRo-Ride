/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

// Helper function to calculate distance between two points using Haversine formula
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

export interface ILocation {
  id?: string;
  name?: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  type?: string;
}

export interface IRideRequest {
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  notes?: string;
}

export interface IDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  rating: number;
  profileImage: string;
  vehicleType: {
    make: string;
    model: string;
    year: number;
    color: string;
    plateNumber: string;
  };
  currentLocation: {
    coordinates: [number, number];
  };
  estimatedArrival: number; // in minutes
}

export interface IRide {
  _id: string;
  rider: {
    _id: string;
    name: string;
    phone: string;
    profilePicture?: string;
  };
  driver?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture: string;
    vehicleType?: {
      make: string;
      model: string;
      year: number;
      color: string;
      plateNumber: string;
    };
    rating?: number;
  };
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  status: string;
  fare: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    totalFare: number;
    currency: string;
  };
  distance: {
    estimated: number;
    actual: number;
  };
  duration: {
    estimated: number;
    actual: number;
  };
  timestamps: {
    requested: string;
    accepted?: string;
    driverArrived?: string;
    pickedUp?: string;
    inTransit?: string;
    completed?: string;
    cancelled?: string;
  };
  rating?: {
    riderRating?: number;
    driverRating?: number;
    riderFeedback?: string;
    driverFeedback?: string;
  };
  pin?: string;
  transactionId?: string;
  payment?: {
    _id: string;
    transactionId?: string;
    status: string;
    method?: string;
    amount: number;
  };
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILocationSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
}

export interface INearbyDrivers {
  count: number;
  drivers: {
    _id: string;
    name: string;
    vehicle: {
      make: string;
      model: string;
    };
    distance: number;
    eta: number;
  }[];
}

export const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Location search API
    searchLocations: builder.query<ILocationSearchResult[], string>({
      query: (query) => ({
        url: `/location/search?q=${encodeURIComponent(query)}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<ILocationSearchResult[]>) => response.data,
    }),

    // Get coordinates from browser geolocation and reverse geocode to address
    getCurrentLocation: builder.query<ILocation, void>({
      queryFn: async () => {
        try {
          // Get current position using browser geolocation
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            });
          });
          
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode to get address using Nominatim (OpenStreetMap)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          
          if (!response.ok) {
            throw new Error("Failed to reverse geocode location");
          }
          
          const data = await response.json();
          const address = data.display_name || "Unknown location";
          
          return {
            data: {
              id: `current-loc-${Date.now()}`,
              name: data.name || address.split(',')[0],
              coordinates: [longitude, latitude],
              address,
              type: 'current'
            }
          };
        } catch (error: any) {
          return {
            error: {
              status: 400,
              data: { message: `Failed to get current location: ${error.message}` }
            }
          };
        }
      },
    }),

    // Reverse geocode coordinates to address
    reverseGeocode: builder.query<ILocation, { lat: number; lng: number }>({
      queryFn: async ({ lat, lng }) => {
        try {
          // Try to use Nominatim for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          
          if (!response.ok) {
            throw new Error("Failed to reverse geocode location");
          }
          
          const data = await response.json();
          const address = data.display_name || "Unknown location";
          const name = data.name || address.split(',')[0];
          
          return {
            data: {
              id: `geocode-${Date.now()}`,
              name,
              address,
              coordinates: [lng, lat], // [longitude, latitude]
              type: 'geocoded'
            }
          };
        } catch (error: any) {
          return {
            error: {
              status: 400,
              data: { message: `Failed to reverse geocode: ${error.message}` }
            }
          };
        }
      },
    }),

    // Get nearby drivers based on location
    getNearbyDrivers: builder.query<INearbyDrivers, [number, number]>({
      query: ([longitude, latitude]) => ({
        url: `/driver/nearby?lng=${longitude}&lat=${latitude}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<INearbyDrivers>) => response.data,
    }),

    // Calculate ride fare based on pickup and dropoff locations
    calculateFare: builder.mutation<
      { fare: number; distance: number; estimatedTime: number },
      { pickupLocation: ILocation; dropoffLocation: ILocation; rideType: string }
    >({
      // Using queryFn instead of query to implement local calculation
      queryFn: async (data) => {
        try {
          // Calculate distance using Haversine formula
          const distance = calculateHaversineDistance(
            data.pickupLocation.coordinates[1],
            data.pickupLocation.coordinates[0],
            data.dropoffLocation.coordinates[1],
            data.dropoffLocation.coordinates[0]
          );
          
          // Calculate time based on average speed of 30 km/h
          const timeMinutes = (distance / 1000) * 2; // 2 minutes per km
          
          // Calculate fare based on ride type
          let baseFare = 50;
          let farePerKm = 30;
          
          if (data.rideType === 'premium') {
            baseFare = 80;
            farePerKm = 45;
          } else if (data.rideType === 'luxury') {
            baseFare = 120;
            farePerKm = 70;
          }
          
          const fare = baseFare + (distance / 1000) * farePerKm;
          
          return {
            data: {
              fare,
              distance,
              estimatedTime: timeMinutes
            }
          };
        } catch {
          return {
            error: {
              status: 500,
              data: { message: 'Failed to calculate fare' }
            }
          };
        }
      },
    }),

    // requestRide
    requestRide: builder.mutation<IResponse<IRide>, IRideRequest>({
      query: (data) => ({
        url: "/rides/request",
        method: "POST",
        data,
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Get active ride for current user
    getActiveRide: builder.query<IRide | null, void>({
      query: () => ({
        url: "/rides/me",
        method: "GET",
      }),
      transformResponse: (response: IResponse<{ rides: IRide[] }>) => {
        try {
          console.log('getActiveRide response:', response);
          
          if (!response || !response.data || !response.data.rides) {
            console.log('Invalid response structure:', response);
            return null;
          }
          
          // Check for active rides first
          const activeStatuses = ['requested', 'accepted', 'picked_up', 'in_transit', 'payment_pending', 'payment_completed'];
          let activeRide = response.data.rides.find(ride => activeStatuses.includes(ride.status));

          // If no active ride, check for recently completed rides that haven't been rated by the current user
          if (!activeRide) {
            const thirtyMinutesAgo = new Date();
            thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

            const unratedCompletedRide = response.data.rides.find(ride =>
              ride.status === 'completed' &&
              new Date(ride.updatedAt) > thirtyMinutesAgo &&
              !ride.rating?.driverRating // Only show if driver hasn't rated yet
            );

            if (unratedCompletedRide) {
              activeRide = unratedCompletedRide;
            }
          }
          
          console.log('Found ride to display:', activeRide);
          return activeRide || null;
        } catch (err) {
          console.error('Error parsing active ride:', err);
          return null;
        }
      },
      providesTags: ["RIDES"],
    }),

    // Cancel ride
    cancelRide: builder.mutation<IRide, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/rides/${id}/cancel`,
        method: "PATCH",
        data: { reason },
      }),
      invalidatesTags: ["RIDES"],
    }),

    // ratingRide
    ratingRide: builder.mutation<IRide, { id: string; rating: number; feedback?: string }>({
      query: ({ id, rating, feedback }) => ({
        url: `/rides/rating/${id}`,
        method: "PATCH",
        data: { rating, feedback },
      }),
      invalidatesTags: ["RIDES"],
      // Transform response to handle success/error consistently
      transformResponse: (response: IResponse<IRide>) => {
        console.log('Rating ride response:', response);
        return response.data;
      },
      // Add onQueryStarted to log the request
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log('Starting rating submission:', arg);
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Rating mutation failed:', error);
        }
      },
    }),

    // Get estimated price
    getEstimatedPrice: builder.query<
      { estimatedPrice: number; distance: number; duration: number },
      { pickup: [number, number]; destination: [number, number]; rideType: string }
    >({
      query: ({ pickup, destination, rideType }) => ({
        url: `/rider/estimate-price?pickupLng=${pickup[0]}&pickupLat=${pickup[1]}&destLng=${destination[0]}&destLat=${destination[1]}&type=${rideType}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<{ estimatedPrice: number; distance: number; duration: number }>) =>
        response.data,
    }),

    // Driver accept ride
    acceptRide: builder.mutation<IRide, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/accept-ride/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Driver reject ride
    rejectRide: builder.mutation<IRide, { id: string, reason: string }>({
      query: ({ id }) => ({
        url: `/drivers/reject-ride/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Driver update ride status
    updateRideStatus: builder.mutation<IRide, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/drivers/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Driver verify PIN and start ride
    verifyPin: builder.mutation<IRide, { id: string; pin: string }>({
      query: ({ id, pin }) => ({
        url: `/drivers/verify-pin/${id}`,
        method: "POST",
        data: { pin },
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Get ride by ID
    getRideById: builder.query<IRide, string>({
      query: (id) => ({
        url: `/rides/${id}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<IRide>) => response.data,
      providesTags: ["RIDES"],
    }),

    // Get available rides for driver
    getAvailableRides: builder.query<IRide[], void>({
      query: () => ({
        url: "/rides/available",
        method: "GET",
      }),
      transformResponse: (response: IResponse<IRide[]>) => response.data,
      providesTags: ["RIDES"],
    }),

    // Get ride history for current user
    getRideHistory: builder.query<{
      total: number;
      page: number;
      limit: number;
      rides: IRide[];
      grouped: { completed: IRide[]; requested: IRide[]; cancelled: IRide[] };
    }, { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: "/rides/me",
        method: "GET",
        params,
      }),
      transformResponse: (response: IResponse<{
        total: number;
        page: number;
        limit: number;
        rides: IRide[];
        grouped: { completed: IRide[]; requested: IRide[]; cancelled: IRide[] };
      }>) => response.data,
      providesTags: ["RIDES"],
    }),

    // Complete a ride (for driver)
    completeRide: builder.mutation<IRide, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES"],
    }),
    
    // Complete payment for a ride
    completePayment: builder.mutation<IRide, { id: string; method: string }>({
      query: ({ id, method }) => ({
        url: `/rides/${id}/complete-payment`,
        method: "PATCH",
        data: { method },
      }),
      invalidatesTags: ["RIDES"],
    }),
    
    // Init payment for online payment
    initPayment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/payment/init-payment/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // getMyRides
    getMyRides: builder.query<{ total: number; rides: IRide[] }, { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: "/rides/me",
        method: "GET",
        params,
      }),
      transformResponse: (response: IResponse<{ total: number; rides: IRide[] }>) => response.data,
      providesTags: ["RIDES"],
    }),

    // getAllRide
    getAllRide: builder.query<{ data: IRide[]; meta: { total: number; page: number; limit: number; totalPages: number } } | IRide[], { page?: number; limit?: number }>({
      query: (params = {}) => ({
        url: "/rides",
        method: "GET",
        params,
      }),
      transformResponse: (response: IResponse<{ data: IRide[]; meta: { total: number; page: number; limit: number; totalPages: number } }> | IRide[] | any) => {
        console.log("Original response in ride-api:", response);
        
        // Check if the response is an array (direct rides array)
        if (Array.isArray(response)) {
          console.log("Response is a direct array");
          return {
            data: response,
            meta: {
              total: response.length,
              page: 1,
              limit: response.length,
              totalPages: 1
            }
          };
        }
        
        // Check if response is wrapped in a data property (standard API response)
        if (response && response.data) {
          console.log("Response has data property");
          return response.data;
        }
        
        // If response is already the expected format
        if (response && response.data && response.meta) {
          console.log("Response already has data and meta");
          return response;
        }
        
        // Fallback
        console.log("Using fallback response format");
        return response;
      },
      providesTags: ["RIDES"],
    }),


// Endpoints
  }),
});

// searchLocations
// getCurrentLocation
// reverseGeocode
// getNearbyDrivers

export const {
  useSearchLocationsQuery,
  useLazySearchLocationsQuery,
  useGetCurrentLocationQuery,
  useReverseGeocodeQuery,
  useLazyReverseGeocodeQuery,
  useGetNearbyDriversQuery,
  useCalculateFareMutation,
  useRequestRideMutation, // requestRide
  useGetActiveRideQuery,    // getActiveRide   Driver, Rider
  useCancelRideMutation,    // cancelRide
  useRatingRideMutation,   // ratingRide      Driver, Rider
  useLazyGetEstimatedPriceQuery,
  useGetEstimatedPriceQuery,
  useAcceptRideMutation,
  useRejectRideMutation,
  useUpdateRideStatusMutation,
  useVerifyPinMutation,
  useGetRideByIdQuery,
  useGetAvailableRidesQuery,  //getAvailableRides  Driver
  useGetMyRidesQuery,       // getMyRides Rider
  useGetAllRideQuery,     // getAllRide   Admin
  useGetRideHistoryQuery,
  useCompleteRideMutation,
  useCompletePaymentMutation,
  useInitPaymentMutation,
} = rideApi;


// getMyRides