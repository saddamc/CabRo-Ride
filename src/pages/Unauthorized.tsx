import { Button } from "@/components/ui/button";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { ShieldAlert } from "lucide-react";
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    const { data: userInfo } = useUserInfoQuery(undefined);
    const userRole = userInfo?.data?.role || '';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                        <ShieldAlert className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
                
                <p className="text-gray-600 dark:text-gray-300">
                    You don't have permission to access this page. This area is restricted to authorized users only.
                </p>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">What can you do?</h2>
                    
                    <div className="space-y-4">
                        {userRole === 'rider' && (
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">As a Rider:</h3>
                                <div className="space-x-2 mt-2">
                                    <Link to="/rider/dashboard">
                                        <Button variant="outline" size="sm">Go to Rider Dashboard</Button>
                                    </Link>
                                    <Link to="/rider/ride-booking">
                                        <Button size="sm">Book a Ride</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        {userRole === 'driver' && (
                            <div>
                                <h3 className="font-medium text-gray-700 dark:text-gray-300">As a Driver:</h3>
                                <div className="space-x-2 mt-2">
                                    <Link to="/driver/dashboard">
                                        <Button variant="outline" size="sm">Go to Driver Dashboard</Button>
                                    </Link>
                                    <Link to="/driver/history">
                                        <Button size="sm">View Ride History</Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-2">
                            <Link to="/">
                                <Button variant="link">Return to Home Page</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;