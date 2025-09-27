import { baseApi } from "@/redux/baseApi";

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
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
}

export interface IRideRequest {
  pickupLocation: {
    address: string;
    coordinates: [number, number];
  };
  destinationLocation: {
    address: string;
    coordinates: [number, number];
  };
  notes?: string;
}

export interface IDriver {
  id: string;
  name: string;
  rating: number;
  profileImage: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  };
  currentLocation: {
    coordinates: [number, number];
  };
  estimatedArrival: number; // in minutes
}

export interface IRide {
  id: string;
  riderId: string;
  driverId: string | null;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  fare: number;
  distance: number;
  estimatedTime: number;
  actualTime?: number;
  startTime?: string;
  endTime?: string;
  paymentStatus: 'pending' | 'completed';
  paymentMethod: string;
  driver?: IDriver;
}

const rideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Search for locations based on query string
    searchLocations: builder.query<ILocation[], string>({
      query: (query) => ({
        url: `/location/search`,
        method: "GET",
        params: { query },
      }),
      transformResponse: (response: { data: ILocation[] }) => response.data,
    }),

    // Reverse geocode coordinates to address
    reverseGeocode: builder.query<ILocation, { lat: number; lng: number }>({
      query: ({ lat, lng }) => ({
        url: `/location/reverse`,
        method: "GET",
        params: { lat, lng },
      }),
      transformResponse: (response: { data: ILocation }) => response.data,
    }),

    // Calculate ride fare based on pickup and dropoff locations
    calculateFare: builder.mutation<
      { fare: number; distance: number; estimatedTime: number },
      { pickupLocation: ILocation; dropoffLocation: ILocation; rideType: string }
    >({
      // Using queryFn instead of query to implement local calculation
      // This avoids the 404 error by not making the actual API call
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

    // Request a ride
    requestRide: builder.mutation<IRide, IRideRequest>({
      query: (data) => ({
        url: `/rides/request`,
        method: "POST",
        data,
      }),
      transformResponse: (response: { data: IRide }) => response.data,
      invalidatesTags: ["RIDES"],
    }),

    // Get nearby drivers
    getNearbyDrivers: builder.query<
      IDriver[],
      { lat: number; lng: number; rideType?: string }
    >({
      query: ({ lat, lng, rideType }) => ({
        url: `/drivers/nearby`,
        method: "GET",
        params: { lat, lng, rideType },
      }),
      transformResponse: (response: { data: IDriver[] }) => response.data,
      providesTags: ["DRIVERS"],
    }),

    // Get current ride for rider
    getCurrentRide: builder.query<IRide, void>({
      query: () => ({
        url: `/rides/current`,
        method: "GET",
      }),
      transformResponse: (response: { data: IRide }) => response.data,
      providesTags: ["RIDES"],
    }),

    // Cancel a ride
    cancelRide: builder.mutation<{ success: boolean }, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Complete a ride (for driver)
    completeRide: builder.mutation<IRide, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}/complete`,
        method: "PUT",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Rate a ride
    rateRide: builder.mutation<
      { success: boolean },
      { rideId: string; rating: number; feedback?: string }
    >({
      query: ({ rideId, ...data }) => ({
        url: `/rides/${rideId}/rate`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Get ride history for user
    getRideHistory: builder.query<
      IRide[],
      { page?: number; limit?: number; status?: string }
    >({
      query: (params) => ({
        url: `/rides/me`,
        method: "GET",
        params,
      }),
      transformResponse: (response: { data: IRide[] }) => response.data,
      providesTags: ["RIDES"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSearchLocationsQuery,
  useLazySearchLocationsQuery,
  useReverseGeocodeQuery,
  useLazyReverseGeocodeQuery,
  useCalculateFareMutation,
  useRequestRideMutation,
  useGetNearbyDriversQuery,
  useGetCurrentRideQuery,
  useCancelRideMutation,
  useCompleteRideMutation,
  useRateRideMutation,
  useGetRideHistoryQuery,
} = rideApi;