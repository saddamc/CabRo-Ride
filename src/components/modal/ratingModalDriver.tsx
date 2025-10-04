import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRatingRideMutation } from '@/redux/features/driver/driver.api';
import { useState } from 'react';
import { toast } from 'sonner';

interface RatingModalDriverProps {
  isOpen: boolean;
  onClose: () => void;
  rideId: string;
  riderName: string;
  onRatingComplete: () => void;
}

export default function RatingModalDriver({
  isOpen,
  onClose,
  rideId,
  riderName,
  onRatingComplete
}: RatingModalDriverProps) {
  console.log('Driver Rating modal props:', { isOpen, rideId, riderName });
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [ratingRide] = useRatingRideMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting driver rating:', { rideId, rating, feedback });
      const result = await ratingRide({ id: rideId, rating, feedback }).unwrap();
      console.log('Driver rating submitted successfully:', result);
      toast.success('Rating submitted successfully!');

      // Reset loading state
      setIsSubmitting(false);

      // After successful submission, call onRatingComplete and close modal
      setTimeout(() => {
        onRatingComplete();
        onClose();

        // Redirect to dashboard to refresh the driver's state
        setTimeout(() => {
          window.location.href = '/driver/dashboard';
        }, 1500);
      }, 500);
    } catch (error) {
      console.error('Error in driver rating process:', error);
      toast.error('Failed to submit rating. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs bg-white border shadow-xl z-[999] p-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold mb-1">Rate your rider</DialogTitle>
          <DialogDescription className="text-gray-600 mb-2 text-xs">
            Rate your experience with {riderName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Star Rating */}
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors focus:outline-none ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-400'
                }`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Selected Rating Display */}
          {rating > 0 && (
            <div className="text-center text-sm text-gray-600">
              You selected {rating} star{rating > 1 ? 's' : ''}
            </div>
          )}

          {/* Feedback Textarea */}
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Leave feedback for this rider (optional)"
            className="w-full px-2 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 text-sm"
            rows={3}
          />

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded shadow text-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Rating...
              </span>
            ) : 'Submit Rating'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}