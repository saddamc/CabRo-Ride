import { Link, useSearchParams } from 'react-router-dom';

export default function Success() {
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get('transactionId');
    const message = searchParams.get('message');
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');

    // Check if essential parameters are present
    const hasRequiredParams = transactionId && status;

    // If parameters are missing, show error state
    if (!hasRequiredParams) {
        return (
            <div className="container mx-auto p-6">
                <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-md">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.234 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-yellow-800 mb-2">
                            Payment Status Unclear
                        </h1>
                        <p className="text-yellow-700 mb-4">
                            We couldn't verify your payment details. Please contact support if you made a payment.
                        </p>
                        {transactionId && (
                            <p className="text-sm text-gray-600 mb-2">
                                Transaction ID: {transactionId}
                            </p>
                        )}
                        <div className="space-x-3">
                            <Link
                                to="/tours"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                to="/user/bookings"
                                className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show success or error based on status
    const isErrorStatus = status && status !== 'success';

    return (
        <div className="container mx-auto p-6">
            <div className={`max-w-md mx-auto p-6 rounded-lg shadow-md ${
                isErrorStatus ? 'bg-red-50 border border-red-200' : 'bg-green-100'
            }`}>
                <div className="text-center">
                    {/* Debug Info */}
                    <div className="bg-gray-100 p-3 rounded mb-4 text-left text-xs font-mono">
                        <div>Status: {status}</div>
                        <div>Transaction ID: {transactionId}</div>
                        <div>Message: {message}</div>
                        <div>Amount: {amount}</div>
                        <div>Has Required Params: {hasRequiredParams ? 'Yes' : 'No'}</div>
                        <div>Is Error Status: {isErrorStatus ? 'Yes' : 'No'}</div>
                    </div>
                    {!isErrorStatus ? (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                    <h1 className={`text-2xl font-bold text-center mb-4 ${
                        isErrorStatus ? 'text-red-800' : 'text-green-800'
                    }`}>
                        {isErrorStatus ? 'Payment Failed' : 'Payment Successful!'}
                    </h1>

                    {status && (
                        <p className={`text-center font-semibold mb-2 ${
                            isErrorStatus ? 'text-red-700' : 'text-green-700'
                        }`}>
                            Status: {status}
                        </p>
                    )}

                    {message && (
                        <p className={`text-center mb-2 ${
                            isErrorStatus ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {decodeURIComponent(message)}
                        </p>
                    )}

                    {transactionId && (
                        <p className="text-center text-gray-700 mb-2">
                            Transaction ID: {transactionId}
                        </p>
                    )}

                    {amount && !isErrorStatus && (
                        <p className="text-center text-gray-700 mb-4">
                            Amount Paid: ${parseFloat(amount).toFixed(2)}
                        </p>
                    )}

                    {/* Booking Status Check */}
                    {!isErrorStatus && status === 'success' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700 mb-2">
                                ✅ Payment completed successfully!
                            </p>
                            <p className="text-xs text-blue-600 mb-3">
                                Your booking should appear in "My Bookings" shortly. Verify the transaction in your bank statement.
                            </p>
                            <div className="flex gap-2 justify-center text-xs">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Status: Processing
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                    Booking: Confirming
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="space-x-3">
                        <Link
                            to="/tours"
                            className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                                isErrorStatus
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isErrorStatus ? 'Try Again' : 'Book Another Tour'}
                        </Link>
                        <Link
                            to="/user/bookings"
                            className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                                isErrorStatus
                                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                            }`}
                        >
                            My Bookings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}