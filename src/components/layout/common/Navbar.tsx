// Cabro-bolt complete navbar design with functional theme toggling
import { useTheme } from '@/hooks/use-theme';
import { Car, ChevronDown, Moon, Sun, User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white">Cabro</span>
          </Link>

          {/* Center: Navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">About</Link>
            <Link to="/features" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Features</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">Contact</Link>
            <Link to="/faq" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors">FAQ</Link>
          </div>

          {/* Right: Auth, theme, role switch */}
          <div className="flex items-center space-x-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white rounded-md bg-primary hover:bg-primary/90 transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">Register</Link>

            {/* Theme button - shows correct icon based on current theme */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
              aria-label="Toggle theme"
            >
              <div className="relative">
                <Sun className={`w-5 h-5 text-yellow-500 transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
                <Moon className={`w-5 h-5 text-blue-300 absolute top-0 left-0 transition-opacity ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
              </div>
            </button>

            {/* Switch Role dropdown (full menu) */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Users className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                Switch Role
                <ChevronDown className="ml-2 w-3 h-3 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center">
                    <User className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                    <span>User</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                    <span>Admin</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center">
                    <Users className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
                    <span>Super Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}