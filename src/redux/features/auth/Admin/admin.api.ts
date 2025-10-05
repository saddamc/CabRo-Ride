import { baseApi } from '@/redux/baseApi';

// Analytics response types
export interface AdminAnalyticsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: {
      totalUsers: number;
      activeUsers: number;
      blockedUsers: number;
    };
    drivers: {
      totalDrivers: number;
      approvedDrivers: number;
      pendingDrivers: number;
    };
    rides: {
      totalRides: number;
      completedRides: number;
      cancelledRides: number;
    };
  };
}

export interface BookingsDataResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    bookings: {
      id: string;
      date: string;
      status: string;
      amount: number;
    }[];
  };
}

export interface EarningsDataResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    earnings: {
      month: string;
      amount: number;
    }[];
  };
}

export interface RideVolumeDataResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    date: string;
    rides: number;
    completed: number;
    cancelled: number;
  }[];
}

export interface DriverActivityDataResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    hour: string;
    activeDrivers: number;
    bookings: number;
  }[];
}

export interface AllUsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    users: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      createdAt: string;
    }[];
  };
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, Record<string, never>>({
      query: () => ({
        url: '/admin/analytics',
        method: 'GET',
      }),
      providesTags: ['admin'],
    }),
    getAllUsers: builder.query<AllUsersResponse, Record<string, never>>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      providesTags: ['admin', 'user'],
    }),
    getBookingsData: builder.query<BookingsDataResponse, Record<string, never>>({
      query: () => ({
        url: '/rides/all',
        method: 'GET',
      }),
      providesTags: ['admin', 'bookings'],
    }),
    getEarningsData: builder.query<EarningsDataResponse, Record<string, string | number>>({
      query: (params) => ({
        url: '/rides/earnings',
        method: 'GET',
        params,
      }),
      providesTags: ['admin', 'payment'],
    }),
    getRideVolumeData: builder.query<RideVolumeDataResponse, void>({
      query: () => ({
        url: '/rides/volume',
        method: 'GET',
      }),
      providesTags: ['admin', 'RIDES'],
    }),
    getDriverActivityData: builder.query<DriverActivityDataResponse, void>({
      query: () => ({
        url: '/rides/activity',
        method: 'GET',
      }),
      providesTags: ['admin', 'RIDES'],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetAllUsersQuery,
  useGetBookingsDataQuery,
  useGetEarningsDataQuery,
  useGetRideVolumeDataQuery,
  useGetDriverActivityDataQuery
} = adminApi;