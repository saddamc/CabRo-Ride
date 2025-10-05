 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfirmPaymentReceivedMutation } from "@/redux/features/driver/driver.api";
import { useGetActiveRideQuery, useRejectRideMutation, useUpdateRideStatusMutation, useVerifyPinMutation } from "@/redux/features/rides/ride.api";
import { CheckCircle2, Clock, MapPin, Navigation, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// No local status state; always use ride.status from server
import RatingModal from "@/components/ui/RatingModal";
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
    rating?: {
      riderRating?: number;
      driverRating?: number;
      riderFeedback?: string;
      driverFeedback?: string;
    };
    paymentMethod?: string;
    transactionId?: string;
  } | null;
}

export default function ActiveRideManagement({ ride }: ActiveRideProps) {
  // For refetching active ride data after cancellation
  const navigate = useNavigate();
  const { refetch: refetchActiveRide } = useGetActiveRideQuery();
  // const [acceptRideMutation] = useAcceptRideMutation();
  const [cancelRideMutation] = useRejectRideMutation();
  const [updateRideStatus, { isLoading }] = useUpdateRideStatusMutation();
  const [verifyPin, { isLoading: isVerifying }] = useVerifyPinMutation();
  const [showPinInput, setShowPinInput] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [confirmPaymentReceived, { isLoading: isConfirming }] = useConfirmPaymentReceivedMutation();
  // Rating modal is now shown only when manually triggered from the completed section

  // Log ride status changes without triggering extra re-renders
  useEffect(() => {
    if (ride) {
      console.log(`Ride status: ${ride.status}`);
    }
  }, [ride]);

  // Show success toast for completed rides
  useEffect(() => {
    if (ride && ride.status === 'completed') {
      toast.success('Ride completed successfully!');
    }
  }, [ride?.status]);

  if (!ride) {
    return (
      <div className="space-y-6">
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

        {/* Available Rides Section */}
        {/* <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Available Rides</CardTitle>
            <CardDescription>Rides waiting for drivers</CardDescription>
          </CardHeader>
          <CardContent>
            {activeRides && activeRides.length > 0 ? (
              <div className="space-y-4">
                {activeRides.map((ride: any) => (
                  <div key={ride._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{ride.rider.name}</p>
                        <p className="text-sm text-gray-600">{ride.rider.phone}</p>
                      </div>
                      <Button
                        onClick={() => handleAcceptRide(ride._id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Accept Ride
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Pickup: {ride.pickupLocation.address}</p>
                      <p>Destination: {ride.destinationLocation.address}</p>
                      <p>Distance: {ride.distance?.estimated?.toFixed(1)} km</p>
                      <p>Fare: ৳{Math.round(ride.fare?.totalFare || 0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No available rides at the moment</p>
            )}
          </CardContent>
        </Card> */}
      </div>
    );
  }

  const getNextStatus = (current: string) => {
    switch (current) {
      case 'accepted':
        return 'picked_up';
      case 'picked_up':
        return 'in_transit';
      case 'in_transit':
        return 'payment_pending';
      case 'payment_pending':
        // Allow driver to confirm payment directly from payment_pending
        return 'completed'; 
      case 'payment_completed':
        return 'completed'; // This will be handled separately
      case 'completed':
        return 'completed';
      default:
        return current;
    }
  };

  const getButtonText = (current: string) => {
    switch (current) {
      case 'accepted':
        return 'Picked Up';
      case 'picked_up':
        return 'Enter PIN';
      case 'in_transit':
        return 'Complete Ride';
      case 'payment_pending':
        return 'Confirm Payment & Complete Ride';
      case 'payment_completed':
        return 'Confirm Received Payment';
      case 'completed':
        return 'Completed';
      default:
        return 'Update Status';
    }
  };

  const handleStatusUpdate = async () => {
    console.log("Current ride status:", ride.status);
    
    if (ride.status === 'picked_up') {
      setShowPinInput(true);
      return;
    }

    if (ride.status === 'payment_completed') {
      // Only confirm payment when status is already payment_completed
      console.log("Processing payment confirmation for ride:", ride._id);
      await handleConfirmPayment();
      return;
    }
    
    if (ride.status === 'payment_pending') {
      // For payment_pending, we need to first update to payment_completed before confirming
      console.log("Updating ride from payment_pending to payment_completed");
      try {
        await updateRideStatus({
          id: ride._id,
          status: 'payment_completed'
        }).unwrap();
        
        toast.success("Payment status updated. You can now confirm the payment.");
        await refetchActiveRide();
      } catch (error) {
        console.error('Error updating payment status:', error);
        toast.error("Failed to update payment status. Please try again.");
      }
      return;
    }

    const nextStatus = getNextStatus(ride.status);
    if (nextStatus === ride.status) return;

    try {
      await updateRideStatus({
        id: ride._id,
        status: nextStatus
      }).unwrap();

      toast.success(`Ride status updated! Status has been updated to ${nextStatus.replace('_', ' ')}.`);
      await refetchActiveRide();
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast.error("Failed to update status. Could not update the ride status. Please try again.");
    }
  };

  const handleConfirmPayment = async (showRating = false) => {
    try {
      const paymentMethod = ride.paymentMethod || 'cash'; // Default to cash if not specified
      console.log(`Confirming ${paymentMethod} payment for ride:`, ride._id);
      
      await confirmPaymentReceived({
        id: ride._id
      }).unwrap();
      
      // Different success messages based on payment method
      const successMessage = paymentMethod === 'cash' 
        ? 'Cash payment received! Ride completed successfully.' 
        : 'Payment confirmed! Ride completed successfully.';
      
      toast.success(successMessage);
      await refetchActiveRide();

      // Optionally show rating modal
      if (showRating) {
        setShowRatingModal(true);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error("Failed to confirm payment. Please try again.");
    }
  };

  // Rating completion is now handled inline in the RatingModal component

  const handleVerifyPin = async () => {
    if (!enteredPin) return;

    try {
      await verifyPin({
        id: ride._id,
        pin: enteredPin
      }).unwrap();

      toast.success('PIN verified! Ride started.');
      setShowPinInput(false);
      setEnteredPin('');
      await refetchActiveRide();
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error("Invalid PIN. Please try again.");
    }
  };




  const handleCancelRide = async () => {
    if (!ride?._id) return;
    try {
      await cancelRideMutation({ id: ride._id, reason: 'Driver cancelled' }).unwrap();
      toast.success('Ride has been cancelled.');
      await refetchActiveRide();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast.error('Failed to cancel ride. Please try again.');
    }
  };

  // const handleAcceptRide = async (rideId: string) => {
  //   try {
  //     await acceptRideMutation({ id: rideId }).unwrap();
  //     toast.success('Ride accepted successfully!');
  //     // Refetch available rides to update the list
  //     // You might want to refetch active ride as well
  //   } catch (error) {
  //     console.error('Error accepting ride:', error);
  //     toast.error('Failed to accept ride. Please try again.');
  //   }
  // };

  // Allow completing the ride when status is payment_pending or payment_completed
  const isCompleteDisabled = ride.status === 'completed' || ride.status === 'cancelled';
  
  // Prevent cancelling once payment is in process or complete
  const isCancelDisabled = ride.status === 'in_transit' || ride.status === 'payment_pending' || ride.status === 'payment_completed' || ride.status === 'completed' || ride.status === 'cancelled';

  return (
    <Card className="border-0 shadow-md mb-8">
      <CardHeader className="border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Active Ride</CardTitle>
            <CardDescription>Manage your current ride</CardDescription>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm capitalize">
            {ride.status.replace('_', ' ')}
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



                
                {(ride.status === 'picked_up' || ride.status === 'in_transit' || ride.status === 'completed') && (
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
                
                {(ride.status === 'in_transit' || ride.status === 'payment_pending' || ride.status === 'payment_completed' || ride.status === 'completed') && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                      <Navigation className="w-3 h-3 text-blue-600" />
                    </span>
                    <p className="flex items-center font-semibold text-gray-900">In Transit</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
                  </li>
                )}

                {(ride.status === 'payment_pending' || ride.status === 'payment_completed' || ride.status === 'completed') && (
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
                      <CheckCircle2 className="w-3 h-3 text-yellow-600" />
                    </span>
                    <p className="flex items-center font-semibold text-gray-900">Payment Pending</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
                  </li>
                )}
                
                {ride.status === 'completed' && (
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
                
                {ride.status === 'cancelled' && (
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
                {/* Debug info */}
                {/* <div className="text-xs text-gray-400 mb-2">
                  Current status: {ride.status}
                </div> */}

                {/* PIN input section */}
                {showPinInput ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={enteredPin}
                      onChange={(e) => setEnteredPin(e.target.value)}
                      placeholder="Enter 4-digit PIN"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={4}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleVerifyPin}
                        disabled={isVerifying || enteredPin.length !== 4}
                        className={`flex-1 w-auto h-auto max-w-full text-base font-semibold py-3 rounded-xl shadow-lg transition-all duration-200
                          ${isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D22DF] text-white hover:bg-blue-900'}
                          ${!(isVerifying || enteredPin.length !== 4) ? 'ring-2 ring-blue-200' : ''}
                        `}
                        style={{ letterSpacing: 1 }}
                      >
                        {isVerifying ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          <span>Start Ride</span>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowPinInput(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                
                // Payment completed section - special handling (also handle payment_pending status)
                ) : ride.status === 'payment_completed' || ride.status === 'payment_pending' ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 mb-2 flex flex-col items-center text-center">
                      {ride.status === 'payment_pending' ? (
                        <span className="font-medium leading-tight break-words">
                          Payment is pending! Wait for the rider to complete payment before confirming.
                        </span>
                      ) : (
                        <span className="font-medium leading-tight break-words">
                          Payment completed! Now confirm receipt to complete the ride.
                        </span>
                      )}
                    </div>
                    <div className="w-auto h-auto flex justify-center items-center">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={isLoading || isConfirming || ride.status === 'payment_pending'}
                        className={`w-auto h-auto max-w-full text-base font-semibold py-3 rounded-xl shadow-lg transition-all duration-200
                          ${isLoading || isConfirming ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D22DF] text-white hover:bg-blue-900'}
                          ${!(isLoading || isConfirming || ride.status === 'payment_pending') ? 'ring-2 ring-blue-200' : ''}
                        `}
                        style={{ letterSpacing: 1 }}
                      >
                        {isLoading || isConfirming ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span>Confirm Received Payment</span>
                        )}
                      </Button>
                    </div>
                  </div>
                
                // Completed ride section
                ) : ride.status === 'completed' ? (
                  <div className="space-y-3">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-green-700 mb-2">Ride Completed Successfully!</h3>
                      <p className="text-sm text-gray-600 mb-4">Thank you for driving with us.</p>
                      
                      {/* Fare amount */}
                      <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                        <p className="text-sm text-gray-500">Fare Amount</p>
                        <p className="text-2xl font-bold text-primary">৳{Math.round(ride.fare.totalFare)}</p>
                      </div>
                      
                      {/* Payment details */}
                      {ride.transactionId && (
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4">
                          <p className="font-medium text-blue-800">Payment Transaction ID:</p>
                          <p className="font-mono text-sm break-all text-blue-700">{ride.transactionId}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3 mt-5">
                        {/* Ratings and vehicle/payment info */}
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 text-xs text-left mb-2">
                          <div className="bg-blue-50 rounded p-2">
                            <div className="font-semibold text-blue-800 mb-1">My Rating</div>
                            {ride.rating?.driverRating ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <span key={star} className={`text-base ${star <= (ride.rating?.driverRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                  ))}
                                  <span className="ml-1">{ride.rating.driverRating}/5</span>
                                </div>
                                {ride.rating.driverFeedback && (
                                  <div className="text-xs text-gray-700 mt-1 italic">"{ride.rating.driverFeedback}"</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not rated</span>
                            )}
                          </div>
                          <div className="bg-green-50 rounded p-2">
                            <div className="font-semibold text-green-800 mb-1">Rider Rating</div>
                            {ride.rating?.riderRating ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <span key={star} className={`text-base ${star <= (ride.rating?.riderRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                                  ))}
                                  <span className="ml-1">{ride.rating.riderRating}/5</span>
                                </div>
                                {ride.rating.riderFeedback && (
                                  <div className="text-xs text-gray-700 mt-1 italic">"{ride.rating.riderFeedback}"</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">Not rated</span>
                            )}
                          </div>
                          <div className="bg-gray-50 rounded p-2">
                            <div className="font-semibold text-gray-800 mb-1">Vehicle / Payment</div>
                            <div className="text-gray-700">
                              {ride.paymentMethod ? ride.paymentMethod.charAt(0).toUpperCase() + ride.paymentMethod.slice(1) : 'N/A'}
                            </div>
                          </div>
                        </div>
                        {/* Rating button or summary */}
                        <Button
                          onClick={() => {
                            setShowRatingModal(true);
                          }}
                          className="w-full bg-[#0D22DF] text-white hover:bg-blue-700 py-3 text-base"
                        >
                          ⭐ {ride.rating?.driverRating ? 'Edit Rating' : 'Rate Rider'} ({ride.rider.name})
                        </Button>
                        <Button
                          onClick={() => navigate('/driver/dashboard')}
                          variant="outline"
                          className="w-full mt-2 py-3 text-base"
                        >
                          Return to Dashboard
                        </Button>
                      </div>
                    </div>
                  </div>
                
                // Default action button for other statuses
                ) : (
                  <div className="w-auto h-auto flex justify-center items-center">
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={isLoading || isConfirming || isCompleteDisabled}
                      className={`w-auto h-auto max-w-full text-base font-semibold py-3 rounded-xl shadow-lg transition-all duration-200
                        ${isLoading || isConfirming ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D22DF] text-white hover:bg-blue-900'}
                        ${!(isLoading || isConfirming || isCompleteDisabled) ? 'ring-2 ring-blue-200' : ''}
                      `}
                      style={{ letterSpacing: 1 }}
                    >
                      {isLoading || isConfirming ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span>{getButtonText(ride.status)}</span>
                      )}
                    </Button>
                  </div>
                )}

                {/* Allow cancel unless completed or cancelled */}
                {!(ride.status === 'completed' || ride.status === 'cancelled') && (
                  <Button
                    onClick={handleCancelRide}
                    disabled={isLoading || isCancelDisabled}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 py-3 h-[48px] text-base font-semibold rounded-xl"
                  >
                    Cancel Ride
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        rideId={ride._id}
        rideStatus={ride.status}
        userRole="driver"
        targetName={ride.rider.name}
        onRatingComplete={() => {
          setShowRatingModal(false);
          toast.success("Thank you for your feedback!");
          // Refetch to update UI with new rating info
          refetchActiveRide();
        }}
      />
    </Card>
  );
}