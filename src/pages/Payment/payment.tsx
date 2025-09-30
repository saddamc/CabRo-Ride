import { Button } from "@/components/ui/button";
import { useCompletePaymentMutation, useGetActiveRideQuery } from "@/redux/features/rides/ride.api";
import React, { useState } from "react";
import { toast } from "sonner";

const PaymentPage: React.FC = () => {
	// Fetch the latest ride with payment pending
	const { data: ride, isLoading, error, refetch } = useGetActiveRideQuery();
	const [completePayment, { isLoading: isPaying }] = useCompletePaymentMutation();
	const [paymentMethod, setPaymentMethod] = useState<string>("");
	const [paymentComplete, setPaymentComplete] = useState(false);

	if (isLoading) return <div>Loading payment info...</div>;
	if (error || !ride) return <div>No pending payment found.</div>;
	if (ride.status !== "payment_pending") return <div>No payment required.</div>;

	const handlePayment = async () => {
		if (!paymentMethod) {
			toast.error("Please select a payment method.");
			return;
		}
		try {
			await completePayment({ id: ride._id, method: paymentMethod }).unwrap();
			setPaymentComplete(true);
			toast.success("Payment successful! Transaction complete.");
			refetch();
		} catch (e) {
			toast.error("Payment failed. Please try again.");
		}
	};

	if (paymentComplete) {
		return (
			<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
				<h2 className="text-2xl font-bold mb-4">Transaction Complete</h2>
				<p>Thank you for your payment!</p>
			</div>
		);
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
			<h2 className="text-2xl font-bold mb-4">Payment Required</h2>
			<p className="mb-2">Amount Due: <span className="font-semibold">৳{ride.fare?.totalFare ?? "-"}</span></p>
			<div className="mb-4">
				<label className="block mb-1 font-medium">Select Payment Method:</label>
				<div className="flex gap-4">
					<Button
						variant={paymentMethod === "cash" ? "default" : "outline"}
						onClick={() => setPaymentMethod("cash")}
						disabled={isPaying}
					>
						Cash
					</Button>
					<Button
						variant={paymentMethod === "sslcommerz" ? "default" : "outline"}
						onClick={() => setPaymentMethod("sslcommerz")}
						disabled={isPaying}
					>
						SSLCommerz
					</Button>
				</div>
			</div>
			<Button onClick={handlePayment} disabled={isPaying || !paymentMethod} className="w-full">
				{isPaying ? "Processing..." : "Pay Now"}
			</Button>
		</div>
	);
};

export default PaymentPage;
