import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCancelRideMutation } from '@/redux/features/rides/ride.api';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface CancelRideHandlerProps {
  rideId: string;
  currentStatus: string;
  onCancelSuccess?: () => void;
  trigger?: React.ReactNode;
  className?: string;
}

export default function CancelRideHandler({
  rideId,
  currentStatus,
  onCancelSuccess,
  trigger,
  className = "w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
}: CancelRideHandlerProps) {
  console.log('CancelRideHandler rendered with:', { rideId, currentStatus });

  const [showWarning, setShowWarning] = useState(false);
  const [cancelRideMutation, { isLoading: isCancelling }] = useCancelRideMutation();
  const { toast } = useToast();

  const handleCancelClick = () => {
    console.log('Cancel button clicked!', { rideId, currentStatus });

    // Show warning if driver has been assigned or ride is in progress
    if (currentStatus === 'driver_assigned' || currentStatus === 'in_progress') {
      console.log('Showing warning dialog');
      setShowWarning(true);
    } else {
      // Direct cancel for other statuses
      console.log('Direct cancel for other status');
      performCancel(false);
    }
  };

  const performCancel = async (isEmergency = false) => {
    try {
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
      onCancelSuccess?.();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      console.error('Error details:', error);

      // Show more detailed error message
      const errorMessage = (error as { data?: { message?: string }; message?: string })?.data?.message || (error as { data?: { message?: string }; message?: string })?.message || 'Could not cancel the ride. Please try again.';
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
        >
          {isCancelling ? 'Cancelling...' : '🚫 Cancel Ride'}
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