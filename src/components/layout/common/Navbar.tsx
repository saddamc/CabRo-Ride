// Cabro-bolt complete navbar design with functional theme toggling and dynamic roles
import { useTheme } from "@/hooks/use-theme";
import {
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";

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

                {/* User avatar button with name */}
                <div className="relative">
                  <button
                    onClick={handleMenuToggle}
                    className="flex items-center gap-3 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-105 bg-gray-100 dark:bg-gray-800 dark:text-white text-gray-900"
                    aria-label="Open user menu"
                  >
                    <img
                      src={
                        userInfo.data.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`
                      }
                      alt={userInfo.data.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('ui-avatars.com')) {
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`;
                        }
                      }}
                    />
                    <span className="text-sm font-medium truncate max-w-24">
                      {userInfo.data.name || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <NavbarDropdown
                    menuOpen={menuOpen}
                    handleMenuClose={handleMenuClose}
                    handleLogout={handleLogout}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}