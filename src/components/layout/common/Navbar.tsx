/* eslint-disable @typescript-eslint/no-explicit-any */
// Cabro-bolt complete navbar design with functional theme toggling and dynamic roles
import { useTheme } from "@/hooks/use-theme";
import {
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, Moon, Shield, Sun, Truck, User, Users } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

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

  // Dropdown state for user menu
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleMenuClose = () => setMenuOpen(false);

  // Get user role from userInfo (adjust based on your data structure)
  const userRole = userInfo?.data?.role || 'rider'; // default to rider

  // Define available roles based on user's current role
  const getAvailableRoles = (currentRole : any) => {
    const roles = [];
    
    // Always show rider option
    roles.push({ key: 'rider', label: 'Rider', icon: User });
    
    // Show driver if user is driver or higher
    if (currentRole === 'driver' || currentRole === 'admin' || currentRole === 'super_admin') {
      roles.push({ key: 'driver', label: 'Driver', icon: Truck });
    }
    
    // Show admin if user is admin or higher
    if (currentRole === 'admin' || currentRole === 'super_admin') {
      roles.push({ key: 'admin', label: 'Admin', icon: Users });
    }
    
    // Show super admin only if user is super admin
    if (currentRole === 'super_admin') {
      roles.push({ key: 'super_admin', label: 'Super Admin', icon: Shield });
    }
    
    return roles;
  };

  const availableRoles = getAvailableRoles(userRole);

  return (
    <nav className="bg-white border-b border-gray-100 dark:bg-black dark:border-gray-800 sticky top-0 z-50">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center text-lg font-bold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white ml-2">Cabro</span>
          </Link>

          {/* Center: Navigation links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary dark:hover:text-primary p-2 rounded-full"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary dark:hover:text-primary p-2 rounded-full"
            >
              About
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary dark:hover:text-primary p-2 rounded-full"
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary dark:hover:text-primary p-2 rounded-full"
            >
              Contact
            </Link>
            <Link
              to="/faq"
              className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary dark:hover:text-primary p-2 rounded-full"
            >
              FAQ
            </Link>
          </div>

          {/* Right: Auth, theme, user menu */}
          <div className="flex items-center space-x-3">
            {/* Theme button - always visible */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              <div className="relative">
                <Sun
                  className={`w-5 h-5 text-yellow-500 transition-opacity ${
                    theme === "dark" ? "opacity-0" : "opacity-100"
                  }`}
                />
                <Moon
                  className={`w-5 h-5 text-blue-400 absolute top-0 left-0 transition-opacity ${
                    theme === "dark" ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </button>

            {!userInfo?.data ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            ) : (
              <>

                {/* User avatar button */}
                <div className="relative">
                  <button
                    onClick={handleMenuToggle}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-105"
                    aria-label="Open user menu"
                  >
                    <img
                      src={
                        userInfo.data.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`
                      }
                      alt={userInfo.data.name || 'User'}
                      className="w-9 h-9 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('ui-avatars.com')) {
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`;
                        }
                      }}
                    />
                  </button>
                  
                  {/* Dropdown menu */}
                  {menuOpen && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={handleMenuClose}
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <img
                                src={
                                  userInfo.data.profilePicture ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`
                                }
                                alt={userInfo.data.name || 'User'}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (!target.src.includes('ui-avatars.com')) {
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`;
                                  }
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">
                                {userInfo.data.name || "User Name"}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-yellow-500 font-medium">
                                  {userInfo.data.rating || "4.91"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ⭐ stars
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {userRole}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/fleet"
                            onClick={handleMenuClose}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Fleet
                          </Link>
                          <Link
                            to="/profile"
                            onClick={handleMenuClose}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/account"
                            onClick={handleMenuClose}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Manage account
                          </Link>
                          <Link
                            to="/help"
                            onClick={handleMenuClose}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            Help
                          </Link>
                          
                          {/* Switch Role section - only show if user has multiple roles */}
                          {availableRoles.length > 1 && (
                            <>
                              <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Switch Role
                              </div>
                              {availableRoles.map((role) => {
                                const IconComponent = role.icon;
                                const isCurrentRole = role.key === userRole;
                                
                                return (
                                  <button
                                    key={role.key}
                                    onClick={() => {
                                      // Handle role switch logic here
                                      console.log('Switching to role:', role.key);
                                      handleMenuClose();
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center ${
                                      isCurrentRole
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    <IconComponent className={`w-4 h-4 mr-3 ${
                                      isCurrentRole 
                                        ? 'text-primary' 
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`} />
                                    <span>{role.label}</span>
                                    {isCurrentRole && (
                                      <span className="ml-auto text-xs text-primary">Current</span>
                                    )}
                                  </button>
                                );
                              })}
                            </>
                          )}
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                          <button
                            onClick={() => {
                              handleLogout();
                              handleMenuClose();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}