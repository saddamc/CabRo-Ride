import { useIsMobile } from '@/hooks/use-mobile';
import { useLogoutMutation } from '@/redux/features/auth/auth.api';
import { logout } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Car } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  logo?: React.ReactNode;
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  onToggleSidebar,
  showSidebarToggle = false,
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      localStorage.removeItem('accessToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if API call fails, clear local state
      dispatch(logout());
      localStorage.removeItem('accessToken');
      navigate('/');
    }
    setIsMenuOpen(false);
  };
  
  return (
    <nav className="bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Left section: Logo and sidebar toggle */}
          <div className="flex items-center space-x-4">
            {showSidebarToggle && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md md:hidden hover:bg-accent focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}

            {/* Logo */}
            <div className="flex items-center">
              {logo || (
                <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Cabro</span>
                </Link>
              )}
            </div>
          </div>

          {/* Middle section: Navigation links (hidden on mobile) */}
          {!showSidebarToggle && (
            <div className="items-center hidden space-x-6 md:flex">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* Right section: Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="flex items-center justify-center w-8 h-8 font-medium text-white rounded-full bg-primary">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden text-sm font-medium md:inline-block dark:text-white">
                    {user?.name || 'User'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white md:inline-block"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            {!showSidebarToggle && isMobile && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  {isMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            )}

            {/* Mobile menu */}
            {!showSidebarToggle && isMenuOpen && isMobile && (
              <div className="absolute left-0 right-0 z-50 bg-white border-b shadow-lg top-16 dark:bg-gray-800 dark:border-gray-700 md:hidden">
                <div className="px-4 py-2">
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block py-2 text-sm font-medium ${
                        location.pathname === link.path
                          ? 'text-primary'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
