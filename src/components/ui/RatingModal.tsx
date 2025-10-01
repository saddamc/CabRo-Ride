import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useConfirmPaymentReceivedMutation } from '@/redux/features/driver/driver.api';
import { useRatingRideMutation } from '@/redux/features/rides/ride.api';
import { useState } from 'react';
import { toast } from 'sonner';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  rideStatus: string;
  userRole: 'rider' | 'driver';
  targetName: string;
  onRatingComplete: () => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  rideId,
  rideStatus,
  userRole,
  targetName,
  onRatingComplete
}: RatingModalProps) {
  console.log('Rating modal props:', { isOpen, rideId, rideStatus, userRole, targetName });
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ratingRide] = useRatingRideMutation();
  const [confirmPayment] = useConfirmPaymentReceivedMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (skipRating = false) => {
    if (!skipRating && rating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Only confirm payment if driver is in payment_completed state
      if (userRole === 'driver' && rideStatus === 'payment_completed') {
        console.log('Driver confirming payment for ride:', rideId);
        await confirmPayment({ id: rideId }).unwrap();
        toast.success('Payment confirmed!');
      }

      // Submit rating if not skipping
      if (!skipRating) {
        console.log('Submitting rating:', { rideId, rating, feedback, userRole });
        try {
          const result = await ratingRide({ id: rideId, rating, feedback }).unwrap();
          console.log('Rating submitted successfully:', result);
          toast.success('Rating submitted successfully!');
        } catch (ratingError) {
          console.error('Rating submission error:', ratingError);
          toast.error('Failed to submit rating. Please try again.');
          throw ratingError; // Re-throw to be caught by the outer catch
        }
      } else {
        if (userRole === 'driver') {
          toast.info('Ride completed! You can rate this rider later from your ride history.');
        } else {
          toast.info('Ride completed! You can rate your driver later from your ride history.');
        }
      }

      // After successful submission or skipping, call onRatingComplete and close modal
      setTimeout(() => {
        onRatingComplete();
        onClose();
        
        // Refresh the page after a short delay if it's a driver completing a ride
        if (userRole === 'driver' && rideStatus === 'payment_completed') {
          setTimeout(() => {
            // Redirect to dashboard to refresh the driver's state
            window.location.href = '/driver/dashboard';
          }, 1500);
        }
      }, 500);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (userRole === 'rider') {
      return `Rate your driver`;
    } else {
      return `Rate your rider`;
    }
  };

  const getDescription = () => {
    const action = rideStatus === 'payment_completed' && userRole === 'driver'
      ? 'Confirm payment receipt and '
      : '';
    return `${action}How was your experience with ${targetName}?`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs bg-gradient-to-br from-blue-900 to-blue-700 border-0 shadow-xl z-[999] text-white p-4">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold mb-1">{getTitle()}</DialogTitle>
          <DialogDescription className="text-white/80 mb-2 text-xs">{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Star Rating */}
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-xl transition-colors focus:outline-none ${
                  star <= rating ? 'text-yellow-400' : 'text-white/30'
                }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Feedback Textarea */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Leave feedback (optional)"
            className="w-full px-2 py-1 border border-blue-400 bg-blue-800/60 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-white/60 text-xs"
            rows={2}
          />

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmit(false)}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded shadow text-xs"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Rating'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // For driver confirming payment, still confirm even if skipping rating
                if (userRole === 'driver' && rideStatus === 'payment_completed') {
                  handleSubmit(true); // Skip rating but confirm payment
                } else {
                  handleSubmit(true); // Skip rating entirely
                }
              }}
              disabled={isSubmitting}
              className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-1 rounded shadow text-xs hover:bg-white/20"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : userRole === 'driver' && rideStatus === 'payment_completed'
                ? 'Skip Rating'
                : 'Skip Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}