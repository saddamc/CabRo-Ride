import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { Car, Clock, Map, Settings, Wallet } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "./common/Navbar";

export default function RoleDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const location = useLocation();
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

  // Function to check if a menu item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`flex flex-col min-h-screen ${
      userRole === 'rider' ? 'bg-green-50 dark:bg-gray-900' :
      userRole === 'driver' ? 'bg-blue-50 dark:bg-gray-900' :
      'bg-gray-50 dark:bg-gray-900'
    }`}>
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className={`hidden md:block w-64 border-r p-4 ${
          userRole === 'rider' ? 'bg-green-100 dark:bg-gray-800 border-green-200 dark:border-gray-700' :
          userRole === 'driver' ? 'bg-blue-100 dark:bg-gray-800 border-blue-200 dark:border-gray-700' :
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Main Navigation
            </div>
            
            <Link
              to={`${routePrefix}`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}`) || isActive(`${routePrefix}/`)
                  ? 'text-white bg-primary'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ? 'text-white' : 'text-primary'}`} />
              Dashboard
            </Link>

            {userRole !== 'driver' && (
              <Link
                to={`${routePrefix}/book-ride`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(`${routePrefix}/book-ride`)
                    ? 'text-white bg-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Car className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/book-ride`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                Book your Ride
              </Link>
            )}

            <Link
              to={`${routePrefix}/history`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/history`)
                  ? 'text-white bg-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/history`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Ride History
            </Link>

            <Link
              to={`${routePrefix}/wallet`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/wallet`)
                  ? 'text-white bg-primary'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Wallet className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/wallet`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Wallet
            </Link>
            
            <div className="px-3 py-2 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Account
            </div>
            
            <Link
              to="profile"
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
          <div className="mb-8 bg-white dark:bg-white rounded-lg p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">
              Welcome back, <span className="text-primary">{userInfo?.data?.name || 'User'}</span>!
            </h1>
            <p className="text-gray-600 dark:text-gray-600 mt-1">
              Ready for your next journey?
            </p>
          </div>

          {/* Quick Actions Cards - REMOVED */}

          {/* Dynamic Content */}
          <div className="bg-white dark:bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center p-3 z-50 ${
          userRole === 'rider' ? 'bg-green-100 dark:bg-gray-800 border-green-200 dark:border-gray-700' :
          userRole === 'driver' ? 'bg-blue-100 dark:bg-gray-800 border-blue-200 dark:border-gray-700' :
          'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <Link
            to={`${routePrefix}`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ?
              (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Map className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          {userRole !== 'driver' && (
            <Link
              to={`${routePrefix}/book-ride`}
              className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/book-ride`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <div className={`p-2 rounded-full ${isActive(`${routePrefix}/book-ride`) ?
                (userRole === 'rider' ? 'bg-green-500' : 'bg-primary') :
                'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Car className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Book</span>
            </Link>
          )}

          <Link
            to={`${routePrefix}/history`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/history`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/history`) ?
              (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">History</span>
          </Link>

          <Link
            to={`${routePrefix}/wallet`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/wallet`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/wallet`) ?
              (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Wallet</span>
          </Link>

          <Link
            to="/profile"
            className="flex flex-col items-center p-1 text-gray-700 dark:text-gray-300"
          >
            <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              <Settings className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
      
  {/* No footer on dashboard */}
    </div>
  );
}