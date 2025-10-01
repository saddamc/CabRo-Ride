import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetWalletQuery } from "@/redux/features/auth/Rider/rider.api";
import { useGetAvailableRidesQuery } from "@/redux/features/rides/ride.api";
import { DollarSign, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarDropdownProps {
  menuOpen: boolean;
  handleMenuClose: () => void;
  handleLogout: () => void;
}

export default function NavbarDropdown({ menuOpen, handleMenuClose, handleLogout }: NavbarDropdownProps) {
  const { data: userInfo } = useUserInfoQuery(undefined);
  // Map API roles to our application roles
  const role = userInfo?.data?.role;
  const userRole = role === 'user' ? 'rider' : role || 'rider';
  // For driver: get available ride requests
  const { data: availableRides } = useGetAvailableRidesQuery(undefined, { skip: userRole !== 'driver' });
  const { data: wallet } = useGetWalletQuery(undefined);

  if (!menuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={handleMenuClose}
      />

      {/* Dropdown */}
  <div className="absolute right-0 mt-2 w-60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 rounded-xl shadow-xl z-[9999] overflow-hidden">
        {/* User Info Header - Different layouts based on role */}
        <div className={`px-4 py-4 border-b border-gray-200 dark:border-gray-700 ${
          userRole === 'rider' ? 'bg-green-50 dark:bg-green-900/20' :
          userRole === 'driver' ? 'bg-blue-50 dark:bg-blue-900/20' :
          userRole === 'admin' ? 'bg-purple-50 dark:bg-purple-900/20' :
          userRole === 'super_admin' ? 'bg-orange-50 dark:bg-orange-900/20' :
          'bg-gray-50 dark:bg-gray-800'
        }`}>
          {userRole === 'driver' ? (
            // Driver layout - image on right
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {userInfo.data.name || "Driver Name"}
                </div>
                {/* Only show rating for non-admin users */}
                {userRole !== 'super_admin' && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 font-medium">
                        {/* Dynamic */}
                      {userInfo.data.rating || "4.91"}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⭐ stars
                    </span>
                  </div>
                )}
                {/* Only show role label for non-admin users */}
                {userRole !== 'super_admin' && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                    {userRole}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <img
                  src={
                    userInfo.data.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`
                  }
                  alt={userInfo.data.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 dark:ring-blue-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('ui-avatars.com')) {
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`;
                    }
                  }}
                />
              </div>
            </div>
          ) : userRole === 'admin' || userRole === 'super_admin' ? (
            // Admin/Super Admin layout - image in middle, no rating, no role label
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <img
                  src={
                    userInfo.data.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=${userRole === 'admin' ? '9333ea' : 'ea580c'}&color=fff&size=96`
                  }
                  alt={userInfo.data.name || 'User'}
                  className={`w-16 h-16 rounded-full object-cover ring-2 ${userRole === 'admin' ? 'ring-purple-200 dark:ring-purple-700' : 'ring-orange-200 dark:ring-orange-700'}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('ui-avatars.com')) {
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=${userRole === 'admin' ? '9333ea' : 'ea580c'}&color=fff&size=96`;
                    }
                  }}
                />
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {userInfo.data.name || `${userRole === 'admin' ? 'Admin' : 'Super Admin'} Name`}
              </div>
            </div>
          ) : (
            // Default layout (rider and others) - image on left
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <img
                  src={
                    userInfo.data.profilePicture ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=10b981&color=fff&size=96`
                  }
                  alt={userInfo.data.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-green-200 dark:ring-green-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('ui-avatars.com')) {
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=10b981&color=fff&size=96`;
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">
                  {userInfo.data.name || "User Name"}
                </div>
                {/* Only show rating for non-admin users */}
                {userRole !== 'super_admin' && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 font-medium">
                      {userInfo.data.rating || "4.91"}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⭐ stars
                    </span>
                  </div>
                )}
                {/* Only show role label for non-admin users */}
                {userRole !== 'super_admin' && (
                  <div className={`text-xs font-medium capitalize ${
                    userRole === 'rider' ? 'text-green-600 dark:text-green-400' :
                    'text-gray-500'
                  }`}>
                    {userRole}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Wallet Cards for Drivers */}
        {userRole === 'driver' && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-3">
              {/* Wallet Balance Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Balance</span>
                </div>
                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {/* Dynamic Wallet Balance */}
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </div>
              </div>

              {/* Today's Earnings Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Today</span>
                </div>
                <div className="text-lg font-bold text-green-900 dark:text-green-100">
                    {/* Dynamic  */}
                  $0.00
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="py-2">
          {/* Rider wallet */}
          {userRole === 'rider' && (
            <Link
              to="/rider/wallet"
              onClick={handleMenuClose}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center">
                <div className="mr-2 rounded-full px-2 font-bold bg-yellow-300/15 text-sm">
                  {wallet?.balance && (
                    <span
                      className="px-2 py-0.5 text-xs rounded-full font-bold"
                      style={{
                        background: 'linear-gradient(90deg, #22d3ee 0%, #16a34a 100%)',
                        color: '#fff',
                        boxShadow: '0 0 8px 2px #16a34a99, 0 2px 8px 0 #22d3ee55',
                        border: '2px solid #16a34a',
                        letterSpacing: '0.5px',
                        fontWeight: 800,
                        textShadow: '0 1px 4px #065f46cc'
                      }}
                    >
                      ${wallet?.balance?.toFixed(2)}
                    </span>
                  )}
                </div>
                <Wallet className="h-4 w-4 mr-2" />
                <span>Wallet</span>
              </div>
            </Link>
          )}
          {/*  */}
          <Link
            to={`${userRole === 'super_admin' || userRole === 'admin' ? '/admin/analytics' : `/${userRole}/dashboard`}`}
            onClick={handleMenuClose}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Dashboard
          </Link>
          {/* Wallet Link for all users */}
          
          {userRole !== 'driver' && (
            <>
              <Link
                to="/ride"
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Book Ride
              </Link>
              <Link
                to={`${userRole === 'super_admin' ? '/admin' : `/${userRole}`}/history`}
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Ride History
              </Link>
              <Link
                to={`${userRole === 'rider' ? '/rider' : userRole === 'driver' ? '/driver' : '/admin'}/profile`}
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Profile
              </Link>
            </>
          )}
          {userRole === 'driver' && (
            <>
              <Link
                to="/driver/dashboard#available-rides"
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                {/* Ride request badge for drivers - moved to left */}
                {userRole === 'driver' && Array.isArray(availableRides) && availableRides.length > 0 && (
                  <span className="absolute top-2 right-24 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">
                    {availableRides.length}
                  </span>
                )}
                Accept Ride
              </Link>
              <Link
                to="/driver/history"
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                History
              </Link>
              <Link
                to="/driver/profile"
                onClick={handleMenuClose}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Profile
              </Link>
            </>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <button
            onClick={() => {
              handleLogout();
              handleMenuClose();
            }}
            className="w-full text-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium rounded-md mx-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}