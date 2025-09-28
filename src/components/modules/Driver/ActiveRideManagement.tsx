import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCancelRideMutation, useUpdateRideStatusMutation } from "@/redux/features/rides/ride.api";
import { CheckCircle2, Clock, MapPin, Navigation, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActiveRideProps {
  ride: {
    _id: string;
    status: string;
    rider: {
      name: string;
      phone: string;
    };
    pickupLocation: {
      address: string;
      coordinates: [number, number];
    };
    destinationLocation: {
      address: string;
      coordinates: [number, number];
    };
    fare: {
      totalFare: number;
      baseFare: number;
      distanceFare: number;
    };
    distance: {
      estimated: number;
    };
    timestamps: {
      requested: string;
      accepted?: string;
      pickedUp?: string;
      completed?: string;
      cancelled?: string;
    };
  } | null;
}

export default function ActiveRideManagement({ ride }: ActiveRideProps) {
  // For refetching active ride data after cancellation
  // const { refetch: refetchActiveRide } = useGetActiveRideQuery();
  // console.log('ActiveRide ✅:', refetchActiveRide);
  const [updateRideStatus, { isLoading }] = useUpdateRideStatusMutation();
  const [cancelRideMutation] = useCancelRideMutation();
  const [currentStatus, setCurrentStatus] = useState<string>(ride?.status || 'accepted');

  if (!ride) {
    return (
      <Card className="border-0 shadow-md mb-8">
        <CardHeader>
          <CardTitle>Active Ride</CardTitle>
          <CardDescription>You don't have any active rides at the moment</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="p-4 bg-gray-100 inline-block rounded-full mb-4">
            <Navigation className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Go online to receive ride requests</p>
        </CardContent>
      </Card>
    );
  }

  const getNextStatus = (current: string) => {
    switch (current) {
      case 'accepted':
        return 'picked_up';
      case 'picked_up':
        return 'in_transit';
      case 'in_transit':
        return 'completed';
      default:
        return current;
    }
  };

  const getButtonText = (current: string) => {
    switch (current) {
      case 'accepted':
        return 'Mark as Picked Up';
      case 'picked_up':
        return 'Start Ride';
      case 'in_transit':
        return 'Complete Ride';
      case 'completed':
        return 'Completed';
      default:
        return 'Update Status';
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus === currentStatus) return;

    try {
      await updateRideStatus({
        id: ride._id,
        status: nextStatus
      }).unwrap();

      toast.success(`Ride status updated! Status has been updated to ${nextStatus.replace('_', ' ')}.`);

      setCurrentStatus(nextStatus);
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast.error("Failed to update status. Could not update the ride status. Please try again.");
    }
  };




  const handleCancelRide = async () => {
    if (!ride?._id) return;
    try {
      await cancelRideMutation({ id: ride._id, reason: 'Driver cancelled' }).unwrap();
      toast.success('Ride has been cancelled.');
      setCurrentStatus('cancelled');
      // Refetch active ride data to update UI
      await refetchActiveRide();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast.error('Failed to cancel ride. Please try again.');
    }
  };

  const isCompleteDisabled = currentStatus === 'completed' || currentStatus === 'cancelled';
  const isCancelDisabled = currentStatus === 'in_transit' || currentStatus === 'completed' || currentStatus === 'cancelled';

  return (
    <Card className="border-0 shadow-md mb-8">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Active Ride</CardTitle>
            <CardDescription>Manage your current ride</CardDescription>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm capitalize">
            {currentStatus.replace('_', ' ')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{ride.rider.name}</p>
                <p className="text-sm text-gray-500">{ride.rider.phone}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 bg-green-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                  <div className="rounded-full p-2 bg-red-100">
                    <MapPin className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <div className="text-sm text-gray-500">Pickup</div>
                    <div className="font-medium">{ride.pickupLocation.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Destination</div>
                    <div className="font-medium">{ride.destinationLocation.address}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{new Date(ride.timestamps.requested).toLocaleTimeString()}</span>
              </div>
              <div>•</div>
              <div>{ride.distance.estimated.toFixed(1)} km</div>
              <div>•</div>
              <div className="font-medium text-primary">৳{Math.round(ride.fare.totalFare)}</div>
            </div>
          </div>
          
          <div className="md:w-1/3 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
            <div className="space-y-4">
              <div className="text-lg font-semibold">Status Timeline</div>
              
              <ol className="relative border-l border-gray-200 ml-3">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  </span>
                  <p className="flex items-center font-semibold text-gray-900">Accepted</p>
                  <p className="text-sm text-gray-500">
                    {ride.timestamps.accepted 
                      ? new Date(ride.timestamps.accepted).toLocaleString() 
                      : new Date(ride.timestamps.requested).toLocaleString()}
                  </p>
                </li>
                
                {(currentStatus === 'picked_up' || currentStatus === 'in_transit' || currentStatus === 'completed') && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </span>
                    <p className="flex items-center font-semibold text-gray-900">Picked Up</p>
                    <p className="text-sm text-gray-500">
                      {ride.timestamps.pickedUp 
                        ? new Date(ride.timestamps.pickedUp).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </li>
                )}
                
                {(currentStatus === 'in_transit' || currentStatus === 'completed') && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                      <Navigation className="w-3 h-3 text-blue-600" />
                    </span>
                    <p className="flex items-center font-semibold text-gray-900">In Transit</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
                  </li>
                )}
                
                {currentStatus === 'completed' && (
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </span>
                    <p className="flex items-center font-semibold text-gray-900">Completed</p>
                    <p className="text-sm text-gray-500">
                      {ride.timestamps.completed 
                        ? new Date(ride.timestamps.completed).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </li>
                )}
                
                {currentStatus === 'cancelled' && (
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white">
                      <CheckCircle2 className="w-3 h-3 text-red-600" />
                    </span>
                    <p className="flex items-center font-semibold text-red-600">Cancelled</p>
                    <p className="text-sm text-gray-500">
                      {ride.timestamps.cancelled 
                        ? new Date(ride.timestamps.cancelled).toLocaleString()
                        : new Date().toLocaleString()}
                    </p>
                  </li>
                )}
              </ol>
              
              <div className="pt-2 space-y-3">
                <Button 
                  onClick={handleStatusUpdate} 
                  disabled={isLoading || isCompleteDisabled}
                  className="w-full"
                >
                  {isLoading ? 'Updating...' : getButtonText(currentStatus)}
                </Button>
                
                <Button 
                  onClick={handleCancelRide} 
                  disabled={isLoading || isCancelDisabled}
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Ride
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}