import { baseApi } from "@/redux/baseApi";
import { useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, Clock, Home, LogOut, Map, Settings, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Admin route prefix
  const routePrefix = '/admin';

  // Function to check if a menu item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch {
      // Ignore network errors but proceed to clear local state
    }

    // Clear client-side auth state
    dispatch(logoutAction());
    dispatch(baseApi.util.resetApiState()); // Clear RTK Query cache

    // Redirect to home after logout
    navigate("/");
    // Small delay then refresh to ensure queries reset
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar - Like Rider/Driver */}
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
            Welcome, {userInfo?.data?.name || 'Administrator'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block w-64 border-r p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Admin Panel
            </div>

            <Link
              to={`${routePrefix}/dashboard`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`)
                  ? 'text-white bg-black'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) ? 'text-white' : 'text-primary'}`} />
              Dashboard
            </Link>

            <div className="px-3 py-2 mt-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Management
            </div>

            <Link
              to={`${routePrefix}/user`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/user`)
                  ? 'text-white bg-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/user`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              User
            </Link>

            <Link
              to={`${routePrefix}/admins`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/admins`)
                  ? 'text-white bg-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Car className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/admins`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Admin
            </Link>

            <Link
              to={`${routePrefix}/rides`}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive(`${routePrefix}/rides`)
                  ? 'text-white bg-black'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className={`mr-2 h-5 w-5 ${isActive(`${routePrefix}/rides`) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              Ride History
            </Link>

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

          {/* Dynamic Content */}
          <div className="bg-white dark:bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t flex justify-around items-center p-3 z-50 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <Link
            to={`${routePrefix}/dashboard`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/dashboard`) || isActive(`${routePrefix}`) ?
              'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Map className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>

          <Link
            to={`${routePrefix}/user`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/user`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/user`) ?
              'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Users className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">User</span>
          </Link>

          <Link
            to={`${routePrefix}/admins`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/admins`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/admins`) ?
              'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Car className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Admin</span>
          </Link>

          <Link
            to={`${routePrefix}/rides`}
            className={`flex flex-col items-center p-1 ${isActive(`${routePrefix}/rides`) ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <div className={`p-2 rounded-full ${isActive(`${routePrefix}/rides`) ?
              'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">History</span>
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