
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetRideHistoryQuery } from "@/redux/features/ride-api";
import { Star, User } from "lucide-react";
import { Card, CardContent } from "./ui/card";
export default function ProfilePicture() {
  const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoQuery(undefined);
  const { data: rideHistory } = useGetRideHistoryQuery({ limit: 100 });

  const totalRides = rideHistory?.total || 0;
  const allRides = rideHistory?.rides || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedRides = allRides.filter((ride: any) => ride.status === 'completed');
  const averageRating = completedRides.length > 0
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      completedRides.reduce((sum: number, ride: any) => sum + (ride.rating?.riderRating || 0), 0) / completedRides.length
    : 0;
  return (
    <div className="flex flex-col items-center">
      {/* Profile sidebar */}
        <div className="md:col-span-1">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                {isUserInfoLoading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
                    </div>
                    <div className="w-2/3 h-6 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-3/4 h-4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                      {userInfo?.data?.profilePicture ? (
                        <img
                          src={userInfo.data.profilePicture}
                          alt="Profile"
                          className="h-24 w-24 object-cover rounded-full border border-gray-200"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold">{userInfo?.data?.name || 'User Name'}</h2>
                    <p className="text-gray-500">{userInfo?.data?.email || 'user@example.com'}</p>
                    <div className="mt-2 mb-4 space-y-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs uppercase">
                        {userInfo?.data?.role || ''}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="text-center mb-6 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Member Since</div>
                    <div className="font-medium">
                      {userInfo?.data?.createdAt 
                        ? new Date(userInfo.data.createdAt).toLocaleDateString() 
                        : 'August 2023'}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Total Rides</div>
                    <div className="font-medium">{totalRides}</div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg text-center">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="font-medium flex items-center justify-center">
                      {averageRating.toFixed(1)}
                      <Star className="h-4 w-4 text-yellow-500 ml-1 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
