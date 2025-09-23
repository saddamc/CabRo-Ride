import { Car, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">Cabro</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your trusted ride-sharing platform connecting riders and drivers for safe, 
              convenient, and affordable transportation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Features
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Services</h3>
            <div className="flex flex-col space-y-2">
              <span className="text-gray-600 dark:text-gray-300">Ride Booking</span>
              <span className="text-gray-600 dark:text-gray-300">Driver Registration</span>
              <span className="text-gray-600 dark:text-gray-300">Corporate Solutions</span>
              <span className="text-gray-600 dark:text-gray-300">Safety Features</span>
              <span className="text-gray-600 dark:text-gray-300">24/7 Support</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  123 Business Street, City, Country
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">contact@cabro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} Cabro. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/safety" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Safety Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}