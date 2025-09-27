 
import { baseApi } from "@/redux/baseApi";

export interface IDriverApplication {
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  };
  documents: {
    driverLicense: string;
    vehicleRegistration: string;
    insurance: string;
  };
  experience?: string;
  references?: string[];
}

export interface IDriverProfile {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
  };
  isOnline: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  rating: number;
  totalRides: number;
  earnings: {
    total: number;
    thisMonth: number;
    thisWeek: number;
  };
  currentLocation?: {
    coordinates: [number, number];
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IDriverStatus {
  isOnline: boolean;
  currentLocation?: {
    coordinates: [number, number];
    address: string;
  };
}

export interface IDriverEarnings {
  totalEarnings: number;
  monthlyEarnings: number;
  weeklyEarnings: number;
  dailyEarnings: number;
  ridesCount: number;
  breakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    tips: number;
    bonuses: number;
  };
  recentRides: {
    _id: string;
    date: string;
    fare: number;
    distance: number;
    duration: number;
  }[];
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Apply to become a driver
    applyDriver: builder.mutation<IDriverProfile, IDriverApplication>({
      query: (data) => ({
        url: "/drivers/apply",
        method: "POST",
        data,
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Set driver online/offline status
    setOnlineOffline: builder.mutation<IDriverProfile, IDriverStatus>({
      query: (data) => ({
        url: "/drivers/available",
        method: "POST",
        data,
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Accept a ride
    acceptRide: builder.mutation<IDriverProfile, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/accept-ride/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["RIDES", "DRIVER"],
    }),

    // Reject a ride
    rejectRide: builder.mutation<IDriverProfile, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/reject-ride/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES", "DRIVER"],
    }),

    // Update ride status (for drivers to update ride progress)
    updateRideStatus: builder.mutation<IDriverProfile, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/drivers/status/${id}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: ["RIDES", "DRIVER"],
    }),

    // Get driver earnings
    getDriverEarnings: builder.query<IDriverEarnings, void>({
      query: () => ({
        url: "/drivers/earnings",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    // Update driver profile
    updateDriverDoc: builder.mutation<IDriverProfile, Partial<IDriverProfile>>({
      query: (data) => ({
        url: "/drivers/update-me",
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Rate a ride (as driver)
    ratingRide: builder.mutation<IDriverProfile, { id: string; rating: number; feedback?: string }>({
      query: ({ id, rating, feedback }) => ({
        url: `/drivers/rating/${id}`,
        method: "PATCH",
        data: { rating, feedback },
      }),
      invalidatesTags: ["RIDES", "DRIVER"],
    }),
    
       // Get driver details
    getDriverDetails: builder.query<IDriverProfile, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    // NOTE: Driver profile data should be obtained from /users/me endpoint
    // when the authenticated user has role 'driver'. The user info will include driver data.
  }),
});

export const {
  // applyDriver
  useApplyDriverMutation,
  // setOnlineOffline
  useSetOnlineOfflineMutation,
  // acceptRide
  useAcceptRideMutation,
  // rejectRide
  useRejectRideMutation,
  // updateRideStatus
  useUpdateRideStatusMutation,
  // driverEarnings
  useGetDriverEarningsQuery,
  // updateDriverDoc
  useUpdateDriverDocMutation,
  // ratingRide
  useRatingRideMutation,
  // getDriverDetails
  useGetDriverDetailsQuery,

} = driverApi;

// findNearbyDrivers
// approvedDriver
// suspendDriver
