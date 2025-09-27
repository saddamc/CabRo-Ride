import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAcceptRideMutation, useGetRideByIdQuery } from "@/redux/features/rides/ride.api";
import { CheckCircle, Clock, DollarSign, MapPin, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AcceptRide() {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get('rideId');
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: ride, isLoading, error } = useGetRideByIdQuery(rideId || '', {
    skip: !rideId,
  });

  const [acceptRide, { isLoading: isAccepting }] = useAcceptRideMutation();

  useEffect(() => {
    if (error) {
      toast({
        title: "Ride not found",
        description: "The ride you're trying to accept doesn't exist or is no longer available.",
        variant: "destructive",
      });
      navigate('/driver/dashboard');
    }
  }, [error, toast, navigate]);

  const handleAcceptRide = async () => {
    if (!rideId) return;

    try {
      await acceptRide({ id: rideId }).unwrap();
      toast({
        title: "Ride accepted!",
        description: "You have successfully accepted this ride. Redirecting to dashboard...",
      });
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/driver/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast({
        title: "Failed to accept ride",
        description: "Could not accept this ride. It may have been taken by another driver.",
        variant: "destructive",
      });
      navigate('/driver/dashboard');
    }
  };

  const handleDeclineRide = () => {
    navigate('/driver/dashboard');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading ride details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
              <p className="text-gray-500 mb-4">
                The ride you're looking for doesn't exist or is no longer available.
              </p>
              <Button onClick={() => navigate('/driver/dashboard')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Accept Ride Request</CardTitle>
            <CardDescription>
              Review the ride details and decide whether to accept this ride request.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Rider Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{ride.rider?.name || 'Rider'}</h3>
                <p className="text-sm text-gray-500">{ride.rider?.phone || 'Phone not available'}</p>
              </div>
            </div>

            {/* Route Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full p-2 bg-green-100">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                  <div className="rounded-full p-2 bg-red-100">
                    <MapPin className="h-4 w-4 text-red-500" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Pickup Location</div>
                    <div className="font-medium">{ride.pickupLocation?.address || 'Address not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Destination</div>
                    <div className="font-medium">{ride.destinationLocation?.address || 'Address not available'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="font-medium">{ride.distance?.estimated || 0} km</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Fare</div>
                  <div className="font-medium text-green-600">
                    ৳{Math.round(ride.fare?.totalFare || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleAcceptRide}
                disabled={isAccepting}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isAccepting ? 'Accepting...' : 'Accept Ride'}
              </Button>
              <Button
                onClick={handleDeclineRide}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}