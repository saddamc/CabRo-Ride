import { baseApi } from "@/redux/baseApi";

export interface IDriverStatus {
  availability: 'online' | 'offline' | 'busy';
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
}

export interface IDriverUpdateResponse {
  success: boolean;
  message: string;
  data: IDriverStatus;
}

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

export interface IVehicleDetails {
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  color?: string;
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

export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle driver online/offline status
    toggleDriverStatus: builder.mutation<IDriverUpdateResponse, void>({
      query: () => ({
        url: '/drivers/status',
        method: 'PATCH',
      }),
      invalidatesTags: ["DRIVER_STATUS"],
    }),
    
    // Get driver details including availability status
    getDriverDetails: builder.query<IDriverDetails, void>({
      query: () => ({
        url: '/drivers/me',
        method: 'GET',
      }),
      providesTags: ["DRIVER_STATUS", "DRIVER"],
    }),
    
    // Get driver earnings
    getDriverEarnings: builder.query<IDriverEarnings, void>({
      query: () => ({
        url: '/drivers/earnings',
        method: 'GET',
      }),
      providesTags: ["EARNINGS"],
    }),
    
    // Update driver details like vehicle info
    updateDriverDetails: builder.mutation<IDriverUpdateResponse, Partial<IVehicleDetails>>({
      query: (data) => ({
        url: '/drivers/update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ["DRIVER"],
    }),
  }),
});

export const { 
  useToggleDriverStatusMutation, 
  useGetDriverDetailsQuery,
  useGetDriverEarningsQuery,
  useUpdateDriverDetailsMutation
} = driverApi;