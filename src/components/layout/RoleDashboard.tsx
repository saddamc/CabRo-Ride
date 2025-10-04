import { useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, Clock, DollarSign, Home, LogOut, Map, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function RoleDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    // Exact match
    if (location.pathname === path) return true;
    
    // Special case for nested routes like details-history
    if (path.includes('/history') && location.pathname.includes('/details-history')) return true;
    
    return false;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await logout({}).unwrap();
    } catch {
      // Ignore network errors but proceed to clear local state
    }

    // Clear client-side auth state
    dispatch(logoutAction());
    localStorage.removeItem("accessToken");

    // Redirect to home after logout
    navigate("/");
    // Small delay then refresh to ensure queries reset
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className={`flex flex-col min-h-screen ${
      userRole === 'rider' ? 'bg-green-50 dark:bg-gray-900' :
      userRole === 'driver' ? 'bg-blue-50 dark:bg-gray-900' :
      'bg-gray-50 dark:bg-gray-900'
    }`}>
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Welcome, {userInfo?.data?.name || 'User'}
          </div>
        </div>
      </div>

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
                isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) || isActive(`${routePrefix}/`)
                  ? 'text-white bg-black'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ? 'text-white' : 'text-primary'}`} />
              Dashboard
            </Link>

            {userRole === 'rider' && (
              <Link
                to="/ride"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/ride')
                    ? 'text-white bg-black'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Car className={`mr-2 h-5 w-5 ${isActive('/ride') ? 'text-white' : 'text-primary'}`} />
                Book Ride
              </Link>
            )}

            <Link
              to={`${routePrefix}/history`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/history`)
                  ? 'text-white bg-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/history`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Ride History
            </Link>

            {userRole === 'driver' && (
              <Link
                to={`${routePrefix}/earnings`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(`${routePrefix}/earnings`)
                    ? 'text-white bg-black'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <DollarSign className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/earnings`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                Earnings
              </Link>
            )}
            
            <div className="px-3 py-2 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Account
            </div>
            
            <Link
              to={`${routePrefix}/profile`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/profile`)
                  ? 'text-white bg-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Settings className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/profile`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Profile Settings
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 w-full text-left"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Dashboard Content */}
          {location.pathname.endsWith('/dashboard') || location.pathname === routePrefix || location.pathname === `${routePrefix}/` ? (
            <div className="mb-8 bg-white dark:bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">
                Welcome back, <span className="text-primary">{userInfo?.data?.name || 'User'}</span>!
              </h1>
              <p className="text-gray-600 dark:text-gray-600 mt-1">
                Ready for your next journey?
              </p>
            </div>
          ) : null}

          {/* Dynamic Content */}
          <div style={{ position: 'relative', zIndex: 1 }} className={location.pathname.includes('history') || location.pathname.includes('details-history') ? '' : 'bg-white dark:bg-white rounded-lg shadow p-6'}>
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
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) || isActive(`${routePrefix}/`) ?
              (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Map className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          {userRole === 'rider' && (
            <Link
              to="/ride"
              className={`flex flex-col items-center p-1 ${isActive('/ride') ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <div className={`p-2 rounded-full ${isActive('/ride') ?
                (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
                'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Car className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Book Ride</span>
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

          {userRole === 'driver' && (
            <Link
              to={`${routePrefix}/earnings`}
              className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/earnings`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
            >
              <div className={`p-2 rounded-full ${isActive(`${routePrefix}/earnings`) ?
                'bg-blue-500' :
                'bg-gray-200 dark:bg-gray-700'
              }`}>
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-xs mt-1">Earnings</span>
            </Link>
          )}

          <Link
            to={`${routePrefix}/profile`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/profile`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/profile`) ?
              (userRole === 'rider' ? 'bg-green-500' : userRole === 'driver' ? 'bg-blue-500' : 'bg-primary') :
              'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Settings className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-1 text-red-600 dark:text-red-400"
          >
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
      
  {/* No footer on dashboard */}
    </div>
  );
}