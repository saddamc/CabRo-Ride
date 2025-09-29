import { useToast } from '@/components/ui/use-toast';
import { useCancelRideMutation, useGetActiveRideQuery } from '@/redux/features/rides/ride.api';
import { useState } from 'react';
import { toast as sonnerToast } from 'sonner';
import CancelRideModal from '../modal/cancelRideModal';

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
  buttonText = 'Cancel Ride',
  className = "w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-300 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
}: CancelRideProps) {
  console.log('CancelRide rendered with:', { rideId, currentStatus });

  const [cancelRideMutation, { isLoading: isCancelling }] = useCancelRideMutation();
  const { refetch: refetchActiveRide } = useGetActiveRideQuery();
  const [showModal, setShowModal] = useState(false);

  const { toast } = useToast();

  const handleCancelClick = () => {
    console.log('Cancel button clicked!', { rideId, currentStatus });
    setShowModal(true);
  };

  const handleConfirmCancel = () => {
    performCancel();
  };

  const performCancel = async () => {
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
      
      console.log('Attempting to cancel ride:', { id: rideId, reason: 'User requested cancellation' });

      const result = await cancelRideMutation({
        id: rideId,
        reason: 'User requested cancellation'
      }).unwrap();

      console.log('Cancel ride success:', result);


      // Sonner toast notification for successful ride cancellation
      sonnerToast.success('Ride cancelled successfully.');
      toast({
        title: 'Ride cancelled successfully',
        description: 'Your ride has been cancelled.',
      });

      setShowModal(false);

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

      <CancelRideModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}
