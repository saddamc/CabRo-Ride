import { baseApi } from "@/redux/baseApi";

export interface ILocation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number];
  type: string;
}

export interface IRideRequest {
  pickupLocation: ILocation;
  dropoffLocation: ILocation;
  rideType: string;
  fare: number;
  distance: number;
  estimatedTime: number;
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
      query: (data) => ({
        url: `/rides/calculate-fare`,
        method: "POST",
        data,
      }),
      transformResponse: (response: {
        data: { fare: number; distance: number; estimatedTime: number };
      }) => response.data,
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
        url: `/rides/history`,
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