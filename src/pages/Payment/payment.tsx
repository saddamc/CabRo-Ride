import RatingModal from "@/components/ui/RatingModal";
import { useGetActiveRideQuery } from "@/redux/features/rides/ride.api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCompletePaymentMutation, useInitPaymentMutation } from "../../redux/features/ride-api";

const PaymentPage: React.FC = () => {
  // Fetch the latest ride with payment pending
  const { data: ride, isLoading, error, refetch } = useGetActiveRideQuery();
  const [completePayment, { isLoading: isPaying }] = useCompletePaymentMutation();
  const [initPayment] = useInitPaymentMutation();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg font-semibold text-gray-600">Loading payment info...</p>
    </div>
  );
  if (error || !ride) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-lg font-semibold text-red-500">No pending payment found.</p>
    </div>
  );

  // Show payment complete page (with transaction ID and rating button)
  if (ride.status === "payment_completed" || ride.status === "completed") {
    return (
      <>
        <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg text-center">
          <div className="flex flex-col items-center mb-4">
            <svg className="h-16 w-16 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-3xl font-bold mb-2 text-green-700">Payment Completed!</h2>
          </div>
          <p className="mb-4 text-lg text-gray-700">Thank you for using our ride service!</p>
          <p className="mb-2 text-sm text-gray-600">Your payment has been processed successfully.</p>

          {/* Transaction ID prominently displayed */}
          {ride.transactionId && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-800">Transaction ID:</p>
              <p className="font-mono text-sm break-all text-blue-700">{ride.transactionId}</p>
            </div>
          )}

          {/* Amount Paid */}
          {ride.fare?.totalFare && (
            <p className="mb-4 text-gray-700">Amount Paid: ৳{ride.fare.totalFare}</p>
          )}

          <div className="space-y-3">
            {/* Show rating button if not rated yet */}
            {!ride.rating?.riderRating && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-semibold py-3 rounded-xl shadow hover:from-blue-600 hover:to-green-600 transition-all duration-200"
              >
                ⭐ Rate Your Driver ({ride.driver?.user?.name || 'Driver'})
              </button>
            )}
            {/* Show rating summary if already rated */}
            {ride.rating?.riderRating && (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-3">
                <div className="flex justify-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-2xl ${star <= (ride.rating?.riderRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="font-medium text-yellow-800">You rated this driver: {ride.rating.riderRating}/5</p>
                {ride.rating.riderFeedback && (
                  <p className="text-sm text-gray-700 mt-2 italic">"{ride.rating.riderFeedback}"</p>
                )}
              </div>
            )}
            <button
              onClick={() => navigate('/rider/dashboard')}
              className="w-full bg-gray-500 text-white text-lg font-semibold py-3 rounded-xl shadow hover:bg-gray-600 transition-all duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        {/* Rating Modal */}
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          rideId={ride._id}
          rideStatus="completed"
          userRole="rider"
          targetName={ride.driver?.user?.name || 'Driver'}
          onRatingComplete={() => {
            setShowRatingModal(false);
            refetch(); // Refresh to show rating summary
          }}
        />
      </>
    );
  }

  // Only show payment form if payment is required and not already completed
  if (ride.status !== "payment_pending") {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg text-center">
        <div className="flex flex-col items-center mb-4">
          <svg className="h-16 w-16 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-3xl font-bold mb-2 text-green-700">Ride Completed!</h2>
        </div>
        <p className="mb-4 text-lg text-gray-700">Thank you for using our ride service!</p>
        <p className="mb-2 text-sm text-gray-600">Your ride has been completed successfully.</p>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-semibold py-3 rounded-xl shadow hover:from-blue-600 hover:to-green-600 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    try {
      if (paymentMethod === 'sslcommerz') {
        await initPayment(ride._id).unwrap();
        // initPayment probably redirects to SSLCommerz
      } else {
        await completePayment({ id: ride._id, method: paymentMethod }).unwrap();
        toast.success("Payment successful!");
        refetch();
        setShowRatingModal(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-primary text-center">Payment Required</h2>
      <div className="flex justify-center mb-6">
        <svg className="h-12 w-12 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V6c0-2.21 3.582-4 8-4s8 1.79 8 4v8c0 2.21-3.582 4-8 4z" />
        </svg>
      </div>
      <p className="mb-4 text-lg text-center">Amount Due: <span className="font-semibold text-primary">৳{ride.fare?.totalFare ?? "-"}</span></p>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Select Payment Method:</label>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setPaymentMethod("cash")}
            disabled={isPaying}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              paymentMethod === "cash" ? "bg-green-500 text-white border-none" : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod("sslcommerz")}
            disabled={isPaying}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              paymentMethod === "sslcommerz" ? "bg-blue-500 text-white border-none" : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}
          >
            SSLCommerz
          </button>
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={isPaying || !paymentMethod}
        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-bold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50"
        style={{ letterSpacing: 2 }}
      >
        {isPaying ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentPage;
