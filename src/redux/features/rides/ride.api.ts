/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export interface ILocation {
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRideRequest {
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  notes?: string;
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
    user: {
      name: string;
      phone: string;
      profilePicture?: string;
    };
    vehicle?: {
      make: string;
      model: string;
      year: string;
      color: string;
      licensePlate: string;
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
              coordinates: [longitude, latitude],
              address
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

    // Get nearby drivers based on location
    getNearbyDrivers: builder.query<INearbyDrivers, [number, number]>({
      query: ([longitude, latitude]) => ({
        url: `/driver/nearby?lng=${longitude}&lat=${latitude}`,
        method: "GET",
      }),
      transformResponse: (response: IResponse<INearbyDrivers>) => response.data,
    }),

    // Request a ride
    requestRide: builder.mutation<IRide, IRideRequest>({
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
        // Find active ride (not completed or cancelled)
        const activeStatuses = ['requested', 'accepted', 'picked_up', 'in_transit'];
        const activeRide = response.data.rides.find(ride => activeStatuses.includes(ride.status));
        return activeRide || null;
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

    // Rate ride
    rateRide: builder.mutation<IRide, { id: string; rating: number; feedback?: string }>({
      query: ({ id, rating, feedback }) => ({
        url: `/rides/rating/${id}`,
        method: "PATCH",
        data: { rating, feedback },
      }),
      invalidatesTags: ["RIDES"],
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
        url: `/driver/accept-ride/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Driver reject ride
    rejectRide: builder.mutation<IRide, { id: string }>({
      query: ({ id }) => ({
        url: `/driver/reject-ride/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Driver update ride status
    updateRideStatus: builder.mutation<IRide, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/driver/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["RIDES"],
    }),

    // Get available rides for driver
    getAvailableRides: builder.query<IRide[], void>({
      query: () => ({
        url: "/rides/available",
        method: "GET",
      }),
      transformResponse: (response: IResponse<{ rides: IRide[] }>) => response.data.rides,
      providesTags: ["RIDES"],
    }),
  }),
});

export const {
  useSearchLocationsQuery,
  useLazySearchLocationsQuery,
  useGetCurrentLocationQuery,
  useGetNearbyDriversQuery,
  useRequestRideMutation,
  useGetActiveRideQuery,
  useCancelRideMutation,
  useRateRideMutation,
  useLazyGetEstimatedPriceQuery,
  useAcceptRideMutation,
  useRejectRideMutation,
  useUpdateRideStatusMutation,
  useGetAvailableRidesQuery,
} = rideApi;