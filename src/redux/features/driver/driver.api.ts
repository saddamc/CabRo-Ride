/* eslint-disable @typescript-eslint/no-explicit-any */
 
import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";


export interface IDriverEarnings {
  totalEarnings: number;
  totalTrips: number;
  history: Array<{
    amount: number;
    createdAt: string;
    rideId: string;
    transactionId: string;
  }>;
  // Frontend calculated values
  weeklyEarnings?: number;
  monthlyEarnings?: number;
  dailyEarnings?: number;
}

export interface IDriverDetails {
  _id: string;
  user: string;
  licenseNumber: string;
  vehicleType: IVehicleDetails;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  availability: 'online' | 'offline' | 'busy';
  location: {
    coordinates: [number, number];
    address?: string;
    lastUpdated: string;
  };
  earnings: IDriverEarnings;
  rating: {
    average: number;
    totalRatings: number;
  };
  activeRide?: string | null;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}


//
export interface IDriverStatus {
  availability: 'online' | 'offline' | 'busy';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
}
export interface IDriverUpdateResponse {
  success: boolean;
  message: string;
  data: IDriverStatus;
}

export interface IVehicleDetails {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
}

export interface IDriverApplication {
  licenseNumber: string;
  vehicleType: {
    category: 'CAR' | 'BIKE';
    make: string;
    model: string;
    year: number;
    plateNumber: string;
    color?: string;
  };
  location: {
    coordinates: [number, number];
    address?: string;
    lastUpdated?: Date;
  };
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
  totalTrips: number;
  todayEarnings: number;
  completedToday: number;
  averageRating: number | null;
  totalCompletedRides: number;
  ratedRides: number;
  history: {
    amount: number;
    createdAt: string;
    rideId: string;
    transactionId: string;
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
      transformResponse: (response: IResponse<IDriverEarnings>) => response.data,
      providesTags: ["DRIVER"],
    }),

    // Update driver profile
    updateDriverDoc: builder.mutation<IDriverUpdateResponse, Partial<IVehicleDetails>>({
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
           url: "/drivers/me",
           method: "GET",
         }),
         providesTags: ["DRIVER"],
       }),

    // Get all drivers
    getAllDrivers: builder.query<IDriverProfile[], Record<string, unknown> | void>({
      query: (params) => ({
        url: "/drivers",
        params,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data.map((driver: any) => ({ ...driver, status: driver.status.toLowerCase() as 'pending' | 'approved' | 'suspended' | 'rejected' })),
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
      query: ({ id }) => {
        console.log("Approving driver with ID:", id);
        return {
          url: `/drivers/approved-driver/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["DRIVER", "USER"],
    }),

    // suspendDriver
    suspendDriver: builder.mutation<void, { id: string }>({
      query: ({ id }) => {
        console.log("Suspending driver with ID:", id);
        return {
          url: `/drivers/suspend/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["DRIVER", "USER"],
    }),

    // Confirm payment received
    confirmPaymentReceived: builder.mutation<IDriverProfile, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/confirm-payment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["RIDES", "DRIVER", "WALLET"],
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
  useGetAllDriversQuery,        // getAllDrivers
  useGetFindNearbyDriversQuery,   // findNearbyDrivers
  useApprovedDriverMutation,    // approvedDriver   admin
  useSuspendDriverMutation,         // suspendDrive   admin
  useConfirmPaymentReceivedMutation, // confirmPaymentReceived
  useGetDriverStatusQuery,          // getDriverStatus
} = driverApi;



