import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCancelRideMutation, useGetActiveRideQuery } from '@/redux/features/rides/ride.api';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface CancelRideProps {
  rideId: string;
  currentStatus: string;
  onCancelSuccess?: () => void;
  trigger?: React.ReactNode;
  className?: string;
  buttonText?: string;
}

/**
 * A reusable component for canceling rides with confirmation dialogs.
 * Can be used in any part of the app that needs ride cancellation.
 */
export default function CancelRide({
  rideId,
  currentStatus,
  onCancelSuccess,
  trigger,
  buttonText = '🚫 Cancel Ride',
  className = "w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
}: CancelRideProps) {
  console.log('CancelRide rendered with:', { rideId, currentStatus });

  const [showWarning, setShowWarning] = useState(false);
  const [cancelRideMutation, { isLoading: isCancelling }] = useCancelRideMutation();
  const { refetch: refetchActiveRide } = useGetActiveRideQuery();
  
  const { toast } = useToast();

  const handleCancelClick = () => {
    console.log('Cancel button clicked!', { rideId, currentStatus });

    // Show warning if driver has been assigned or ride is in progress
    if (currentStatus === 'accepted' || currentStatus === 'in_transit' || 
        currentStatus === 'driver_assigned' || currentStatus === 'in_progress') {
      console.log('Showing warning dialog for status:', currentStatus);
      setShowWarning(true);
    } else {
      // Direct cancel for other statuses (like 'requested')
      console.log('Direct cancel for status:', currentStatus);
      performCancel(false);
    }
  };

  const performCancel = async (isEmergency = false) => {
    try {
      // Validate that we have a proper ride ID before trying to cancel
      if (!rideId || rideId === 'undefined' || rideId === 'null') {
        console.error('Invalid ride ID:', rideId);
        toast({
          title: 'Cannot cancel ride',
          description: 'Invalid ride ID. Please refresh the page and try again.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Attempting to cancel ride:', { id: rideId, reason: isEmergency ? 'Emergency cancellation' : 'User requested cancellation' });

      const result = await cancelRideMutation({
        id: rideId,
        reason: isEmergency ? 'Emergency cancellation' : 'User requested cancellation'
      }).unwrap();

      console.log('Cancel ride success:', result);

      toast({
        title: 'Ride cancelled successfully',
        description: isEmergency ? 'Emergency cancellation completed.' : 'Your ride has been cancelled.',
      });

      setShowWarning(false);

      // Refetch active ride to ensure cache is updated before calling success callback
      await refetchActiveRide();

      // Call the success callback after refetch to ensure state updates properly
      setTimeout(() => {
        onCancelSuccess?.();
      }, 100);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      console.error('Error details:', error);

      // Show more detailed error message
      const errorMessage = (error as { data?: { message?: string }; message?: string })?.data?.message || 
                          (error as { data?: { message?: string }; message?: string })?.message || 
                          'Could not cancel the ride. Please try again.';
      toast({
        title: 'Error cancelling ride',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleConfirmCancel = () => performCancel(false);
  const handleEmergencyCancel = () => performCancel(true);

  return (
    <>
      {trigger ? (
        <div onClick={handleCancelClick} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={handleCancelClick}
          disabled={isCancelling}
          className={className}
          data-testid="cancel-ride-button"
        >
          {isCancelling ? 'Cancelling...' : buttonText}
        </button>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Ride Cancellation
            </DialogTitle>
            <DialogDescription className="text-left">
              <p className="mb-3">
                Your ride has already been accepted by a driver. Cancelling now may affect the driver's schedule and could result in additional charges.
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this ride? If this is an emergency, please contact support immediately.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWarning(false)}
              className="w-full sm:w-auto"
            >
              Keep Ride
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="w-full sm:w-auto"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Ride'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmergencyCancel}
              disabled={isCancelling}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? 'Cancelling...' : '🚨 Emergency Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
