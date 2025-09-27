// Cabro-bolt complete navbar design with functional theme toggling and dynamic roles
import { role } from "@/constants/role";
import { useTheme } from "@/hooks/use-theme";
import {
  useLogoutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/rider') || location.pathname.startsWith('/driver') || location.pathname.startsWith('/admin') || location.pathname === '/booking-ride';

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

  // Function to check if a navigation link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`border-b sticky top-0 z-50 ${isDashboard ? 'bg-white border-gray-100' : 'bg-white border-gray-100 dark:bg-black dark:border-gray-800'}`}>
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center text-lg font-bold">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${isDashboard ? 'bg-black' : 'bg-primary'}`}>
              <Car className={`w-5 h-5 ${isDashboard ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`${isDashboard ? 'text-black ml-2' : 'text-gray-900 dark:text-white ml-2'}`}>Cabro</span>
          </Link>

          {/* Center: Navigation links - hidden on dashboard */}
          {!isDashboard && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors p-2 rounded-full ${
                  isActiveLink('/')
                    ? 'bg-primary text-white'
                    : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors p-2 rounded-full ${
                  isActiveLink('/about')
                    ? 'bg-primary text-white'
                    : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link
                to="/features"
                className={`text-sm font-medium transition-colors p-2 rounded-full ${
                  isActiveLink('/features')
                    ? 'bg-primary text-white'
                    : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                Features
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors p-2 rounded-full ${
                  isActiveLink('/contact')
                    ? 'bg-primary text-white'
                    : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className={`text-sm font-medium transition-colors p-2 rounded-full ${
                  isActiveLink('/faq')
                    ? 'bg-primary text-white'
                    : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                }`}
              >
                FAQ
              </Link>
              {/* Book a Ride button - hidden for driver, admin, and super_admin roles */}
              {(!userInfo?.data || (userInfo?.data?.role !== role.driver && userInfo?.data?.role !== role.admin && userInfo?.data?.role !== role.super_admin)) && (
                <Link
                  to={userInfo?.data ? "/booking-ride" : "/login"}
                  state={userInfo?.data ? undefined : { from: "/booking-ride" }}
                  className="text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors py-2 px-4 rounded-full flex items-center"
                  onClick={(e) => {
                    if (!userInfo?.data) {
                      e.preventDefault();
                      // Store the intended destination
                      localStorage.setItem('redirectAfterLogin', '/booking-ride');
                      navigate('/login');
                    }
                  }}
                >
                  <Car className="w-4 h-4 mr-1" />
                  Book a Ride
                </Link>
              )}
            </div>
          )}
{/* Right: Dashboard user menu */}
{isDashboard && userInfo?.data && (
  <div className="flex items-center space-x-3">
    {/* Theme button for dashboard */}
    <button
      onClick={toggleTheme}
      className="p-1 rounded-md hover:bg-gray-100 bg-black text-white transition-colors"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun
          className={`w-5 h-5 text-yellow-500 transition-opacity ${
            theme === "dark" ? "opacity-0" : "opacity-100"
          }`}
        />
        <Moon
          className={`w- h-5 text-blue-400 absolute top-0 left-0 transition-opacity ${
            theme === "dark" ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </button>

    {/* User dropdown for dashboard */}
    <div className="relative">
      <button
        onClick={handleMenuToggle}
        className="flex items-center gap-1.5 px-1 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all  bg-black text-white hover:scale-105"
        aria-label="Open user menu"
      >
        <img
          src={
            userInfo.data.profilePicture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`
          }
          alt={userInfo.data.name || 'User'}
          className="w-6 h-6 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.includes('ui-avatars.com')) {
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.data.name || 'User')}&background=3b82f6&color=fff&size=96`;
            }
          }}
        />
        <span className="text-sm font-medium truncate max-w-20">
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
  </div>
)}

{/* Right: Auth, theme, user menu - hidden on dashboard */}
{!isDashboard && (
  <div className="flex items-center space-x-3">
    {/* Theme button */}
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
            className="flex items-center gap-1.5 px-0.5 py-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-105 bg-gray-100 white:bg-gray-800 white:text-white text-gray-900"
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
)}
        </div>
      </div>
    </nav>
  );
}
