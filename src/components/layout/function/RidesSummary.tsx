/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetRideHistoryQuery } from '@/redux/features/ride-api';
import { Clock, MapPin, Star } from 'lucide-react';

const RidesSummary = () => {
      const { data: rideHistory } = useGetRideHistoryQuery({ limit: 100 });

    // Calculate real stats from ride history
  const allRides = rideHistory?.rides || [];
  const completedRides = allRides.filter((ride: any) => ride.status === 'completed');
  const totalRides = rideHistory?.total || 0;

  // Calculate average rating from completed rides
  const averageRating = completedRides.length > 0
    ? completedRides.reduce((sum: number, ride: any) => sum + (ride.rating?.riderRating || 0), 0) / completedRides.length
    : 0;

  // Calculate total spent and distance from completed rides only
  const totalSpent = completedRides.reduce((sum, ride: any) => sum + (ride.fare?.totalFare || 0), 0);
    const totalDistance = completedRides.reduce((sum, ride: any) => sum + (ride.distance?.actual || ride.distance?.estimated || 0), 0);

    return (
        <div>
            {/* Rider Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-[#0061ff] to-[#60efff] ">
          <CardHeader className="flex  flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRides}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#00ff87] to-[#60efff] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <MapPin className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#ff930f] to-[#fff95b] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <h1>৳</h1>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#ff1b6b] to-[#45caff] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Rating</CardTitle>
            <Star className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Based on {completedRides.length} reviews</p>
          </CardContent>
        </Card>
      </div>
            {/* RideHistory */}
            

            
        </div>
    );
};

export default RidesSummary;