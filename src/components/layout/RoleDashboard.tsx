import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Car, Clock, Map, Settings, Wallet } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import Footer from "./common/Footer";
import Navbar from "./common/Navbar";

export default function RoleDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const userRole = userInfo?.data?.role || 'rider';
  
  // Determine proper route based on user role
  const getRoutePrefix = () => {
    switch(userRole) {
      case 'rider': return '/rider';
      case 'driver': return '/driver';
      case 'admin': return '/admin';
      case 'super_admin': return '/admin';
      default: return '/rider';
    }
  };
  
  const routePrefix = getRoutePrefix();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Main Navigation
            </div>
            
            <Link 
              to={`${routePrefix}`}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
            >
              <Map className="mr-2 h-5 w-5 text-primary" />
              Dashboard
            </Link>
            
            {userRole !== 'admin' && userRole !== 'super_admin' && (
              <Link 
                to={`${routePrefix}/book-ride`}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              >
                <Car className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Book Ride
              </Link>
            )}
            
            <Link 
              to={`${routePrefix}/history`}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <Clock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Ride History
            </Link>
            
            <Link 
              to={`${routePrefix}/wallet`}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <Wallet className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Wallet
            </Link>
            
            <div className="px-3 py-2 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Account
            </div>
            
            <Link 
              to="/profile"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            >
              <Settings className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Profile Settings
            </Link>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Dashboard Content */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-primary">{userInfo?.data?.name || 'User'}</span>!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready for your next journey?
            </p>
          </div>
          
          {/* Quick Actions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-full bg-primary/10 mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Book a Ride</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Request a new ride
                  </p>
                  <Button asChild className="mt-auto">
                    <Link to={`${routePrefix}/book-ride`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 mb-4">
                    <Clock className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Ride History</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    View past rides
                  </p>
                  <Button asChild variant="outline" className="mt-auto">
                    <Link to={`${routePrefix}/history`}>View History</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                    <Wallet className="h-6 w-6 text-green-500 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Wallet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Manage your balance
                  </p>
                  <Button asChild variant="outline" className="mt-auto">
                    <Link to={`${routePrefix}/wallet`}>View Wallet</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Dynamic Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-3 z-50">
          <Link 
            to={`${routePrefix}`}
            className="flex flex-col items-center p-1 text-primary"
          >
            <Map className="h-6 w-6" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          {userRole !== 'admin' && userRole !== 'super_admin' && (
            <Link 
              to={`${routePrefix}/book-ride`}
              className="flex flex-col items-center p-1 text-gray-700 dark:text-gray-300"
            >
              <Car className="h-6 w-6" />
              <span className="text-xs mt-1">Book</span>
            </Link>
          )}
          
          <Link 
            to={`${routePrefix}/history`}
            className="flex flex-col items-center p-1 text-gray-700 dark:text-gray-300"
          >
            <Clock className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
          </Link>
          
          <Link 
            to={`${routePrefix}/wallet`}
            className="flex flex-col items-center p-1 text-gray-700 dark:text-gray-300"
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs mt-1">Wallet</span>
          </Link>
          
          <Link 
            to="/profile"
            className="flex flex-col items-center p-1 text-gray-700 dark:text-gray-300"
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}