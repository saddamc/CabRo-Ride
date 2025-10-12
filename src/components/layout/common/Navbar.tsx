// Cabro-bolt complete navbar design with functional theme toggling and dynamic roles
import { useTheme } from "@/hooks/use-theme";
import { baseApi } from "@/redux/baseApi";
import {
  useLogoutMutation,
  useUserInfoQuery
} from "@/redux/features/auth/auth.api";
import { logout as logoutAction } from "@/redux/features/authSlice";
import { Car, ChevronDown, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarDropdown from "./NavbarDropdown";

const navigationLinks = [
  {
    href: "/",
    label: "Home",
    role: "PUBLIC",
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    href: "/about",
    label: "About",
    role: "PUBLIC",
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/features",
    label: "Features",
    role: "PUBLIC",
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/contact",
    label: "Contact",
    role: "PUBLIC",
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    href: "/faq",
    label: "FAQ",
    role: "PUBLIC",
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/ride",
    label: "Book Ride",
    role: "rider",
    icon: <Car className="w-4 h-4 mr-1" />
  },
];


export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: userInfo } = useUserInfoQuery(undefined);
  // Map API roles to our application roles
  const role = userInfo?.data?.role;
  const userRole = role === 'user' ? 'rider' : role || 'rider';
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/rider') || location.pathname.startsWith('/driver') || location.pathname.startsWith('/admin');

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
    dispatch(baseApi.util.resetApiState()); // Clear RTK Query cache
    localStorage.removeItem("accessToken");

    // Redirect to home after logout
    navigate("/");
    // Delay then refresh to ensure everything is reset
    setTimeout(() => window.location.reload(), 500);
  };

  // Dropdown state for user menu
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleMenuClose = () => setMenuOpen(false);
  const [iconOpen, setIconOpen] = useState(false);
  const handleIconToggle = () => setIconOpen((open) => !open);
  const handleIconClose = () => setIconOpen(false);

  // Function to check if a navigation link is active
  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className={`border-b top-0 z-[10000] relative ${isDashboard ? 'bg-white border-gray-100' : 'bg-white border-gray-100 dark:bg-black dark:border-gray-800'}`}>
        {/* Mobile menu button - positioned absolutely within nav */}
        {!isDashboard && (
          <button
            onClick={handleIconToggle}
            className="md:hidden absolute top-2 left-1 z-[10001] p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-md"
            aria-label="Open mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="block w-4 h-0.5 bg-gray-900 dark:bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-gray-900 dark:bg-white mb-1"></span>
              <span className="block w-4 h-0.5 bg-gray-900 dark:bg-white"></span>
            </div>
          </button>
        )}

        {/* Mobile menu drawer - dropdown under button */}
        {!isDashboard && iconOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-[99998]" onClick={handleIconClose}></div>

            {/* Mobile navigation drawer */}
            <div className="absolute top-14 left-2 w-56 bg-white/60 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-xl p-4 animate-slide-in-left rounded-xl z-[99999]">
              {/* menu header & close button */}
              {/* <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                <button
                  onClick={handleIconClose}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div> */}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigationLinks
                  .filter(link => {
                    // Hide /ride link for driver, admin, and super_admin roles
                    if (link.href === "/ride" && role === 'driver') return false;
                    if (link.href === "/ride" && role === 'admin') return false;
                    if (link.href === "/ride" && role === 'super_admin') return false;
                    return link.role === "PUBLIC" || (link.role === "rider" && userRole === "rider");
                  })
                  .map((link) => (
                    <Link
                      key={link.href}
                      to={link.href === "/ride" && !userInfo?.data ? "/login" : link.href}
                      state={link.href === "/ride" && userInfo?.data ? undefined : link.href === "/ride" ? { from: "/ride" } : undefined}
                      onClick={(e) => {
                        handleIconClose();
                        if (link.href === "/ride" && !userInfo?.data) {
                          e.preventDefault();
                          localStorage.setItem('redirectAfterLogin', '/ride');
                          navigate('/login');
                        }
                      }}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActiveLink(link.href)
                          ? 'bg-primary text-white'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
              </nav>

              {/* Auth buttons */}
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {!userInfo?.data ? (
                  <div className="space-y-1">
                    <Link
                      to="/login"
                      onClick={handleIconClose}
                      className="block w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg text-center hover:bg-primary/90 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={handleIconClose}
                      className="block w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-center hover:from-orange-600 hover:to-orange-700 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    {/* Book a Ride button */}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        handleIconClose();
                      }}
                      className="w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

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
                {navigationLinks
                  .filter(link => {
                    // Hide /ride link for driver, admin, and super_admin roles
                    if (link.href === "/ride" && role === 'driver') return false;
                    if (link.href === "/ride" && role === 'admin') return false;
                    if (link.href === "/ride" && role === 'super_admin') return false;
                    return link.role === "PUBLIC" || (link.role === "rider" && userRole === "rider");
                  })
                  .map((link) => (
                    link.href === "/ride" ? (
                      // Special handling for Book Ride button - hidden for driver, admin, and super_admin roles
                      (!userInfo?.data || (userInfo?.data?.role !== role.driver && userInfo?.data?.role !== role.admin && userInfo?.data?.role !== role.super_admin)) && (
                        <Link
                          key={link.href}
                          to={userInfo?.data ? "/ride" : "/login"}
                          state={userInfo?.data ? undefined : { from: "/ride" }}
                          className="text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors py-2 px-4 rounded-full flex items-center"
                          onClick={(e) => {
                            if (!userInfo?.data) {
                              e.preventDefault();
                              localStorage.setItem('redirectAfterLogin', '/ride');
                              navigate('/login');
                            }
                          }}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      )
                    ) : (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`text-sm font-medium transition-colors p-2 rounded-full ${
                          isActiveLink(link.href)
                            ? 'bg-primary text-white'
                            : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  ))}
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
                      className={`w-5 h-5 text-blue-400 absolute top-0 left-0 transition-opacity ${
                        theme === "dark" ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                </button>

                {/* User dropdown for dashboard */}
                <div className="relative">
                  {/* Profile notification */}
                  {
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
                    // profile top
                  }
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
    </>
  );
}

