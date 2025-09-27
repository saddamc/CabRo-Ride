import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCancelRideMutation } from '@/redux/features/ride/ride.api';
// import { useCancelRideMutation } from '@/redux/features/rides/ride.api';
import { AlertTriangle } from 'lucide-react';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  currentStatus: string;
  onCancelSuccess?: () => void;
}

export default function CancelModal({
  isOpen,
  onClose,
  rideId,
  currentStatus,
  onCancelSuccess
}: CancelModalProps) {
  const [cancelRideMutation, { isLoading: isCancelling }] = useCancelRideMutation();

  const handleConfirmCancel = async (isEmergency = false) => {
    try {
      // Extract the ride ID properly - handle ObjectId, string, or MongoDB extended JSON
      let rideIdString = '';
      if (typeof rideId === 'string') {
        rideIdString = rideId;
      } else if (rideId && typeof rideId === 'object') {
        // Handle MongoDB ObjectId or extended JSON
        const objRideId = rideId as any;
        rideIdString = objRideId.$oid || objRideId.toString?.() || String(objRideId);
      } else {
        rideIdString = String(rideId);
      }

      console.log('Extracted ride ID:', rideIdString);

      const result = await cancelRideMutation({
        id: rideIdString,
        reason: isEmergency ? 'Emergency cancellation' : 'User requested cancellation'
      }).unwrap();

      console.log('Cancel ride success:', result);

      onCancelSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error cancelling ride:', error);
      console.error('Error details:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-gray-200">
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-slot="dialog-overlay"] {
              background: rgba(0, 0, 0, 0.4) !important;
            }
          `
        }} />
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Confirm Ride Cancellation
          </DialogTitle>
          <DialogDescription className="text-left">
            <p className="mb-3">
              {currentStatus === 'driver_assigned' || currentStatus === 'in_progress'
                ? 'Your ride has already been accepted by a driver. Cancelling now may affect the driver\'s schedule and could result in additional charges.'
                : 'Are you sure you want to cancel this ride request?'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone. If this is an emergency, please contact support immediately.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Keep Ride
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleConfirmCancel(false)}
            disabled={isCancelling}
            className="w-full sm:w-auto"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Ride'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleConfirmCancel(true)}
            disabled={isCancelling}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {isCancelling ? 'Cancelling...' : '🚨 Emergency Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}