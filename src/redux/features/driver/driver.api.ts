/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

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
  // data, type from /drivers/me endpoint
  data: any;
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
  vehicleType?: {
    category: 'CAR' | 'BIKE';
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    color?: string;
  };
  isOnline: boolean;
  isApproved: boolean;
  isSuspended: boolean;
  rating: number | {
    average: number;
  };
  totalRides: number;
  stats?: {
    totalRides: number;
    completedToday: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    totalEarnings?: number;
  };
  availability?: string;
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

export interface IDriverDashboard {
  totalTrips: number;
  completedRides: number;
  pendingRides: number;
  cancelledRides: number;
  totalEarnings: number;
  todayEarnings: number;
  completedToday: number;
  averageRating: number;
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
    getDriverEarnings: builder.query<IDriverDashboard, void>({
      query: () => ({
        url: "/drivers/earnings",
        method: "GET",
      }),
      transformResponse: (response: IResponse<IDriverDashboard>) => response.data,
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
      invalidatesTags: ["DRIVER"],
    }),
    
       // Get driver details
    getDriverDetails: builder.query<IDriverProfile, void>({
      query: () => ({
        url: "drivers/me",
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    // findNearByDriver
    getFindNearbyDrivers: builder.query<IDriverProfile[], { latitude: number; longitude: number }>({
      query: ({ latitude, longitude }) => ({
        url: `/drivers/nearby?latitude=${latitude}&longitude=${longitude}`,
        method: "GET",
      }),
      providesTags: ["DRIVER"],
    }),

    // approvedDriver
    approvedDriver: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/approved-driver/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // suspendDriver
    suspendDriver: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/suspend/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DRIVER"],
    }),

    // Confirm payment received
    confirmPaymentReceived: builder.mutation<IDriverProfile, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/confirm-payment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES", "DRIVER"],
    }),

    // Get current driver status (for availability checking)
    getDriverStatus: builder.query<{ availability: string; status: string }, void>({
      query: () => ({
        url: "/drivers/me",
        method: "GET",
      }),
      transformResponse: (response: IResponse<any>) => ({
        availability: response.data.availability || 'offline',
        status: response.data.status || 'pending'
      }),
      providesTags: ["DRIVER"],
    }),

    // NOTE: Driver profile data should be obtained from /users/me endpoint
    // when the authenticated user has role 'driver'. The user info will include driver data.
  }),
});

export const {
  useApplyDriverMutation,      // applyDriver
  useSetOnlineOfflineMutation, // setOnlineOffline
  useAcceptRideMutation,        // acceptRide = Rider
  useRejectRideMutation,    // rejectRide    = Rider
  useUpdateRideStatusMutation, // updateRideStatus
  useGetDriverEarningsQuery,    // driverEarnings
  useUpdateDriverDocMutation,   // updateDriverDoc
  useRatingRideMutation,        // ratingRide
  useGetDriverDetailsQuery,   // getDriverDetails
  useGetFindNearbyDriversQuery,   // findNearbyDrivers
  useApprovedDriverMutation,    // approvedDriver   admin
  useSuspendDriverMutation,         // suspendDrive   admin
  useConfirmPaymentReceivedMutation, // confirmPaymentReceived
  useGetDriverStatusQuery,          // getDriverStatus
} = driverApi;



