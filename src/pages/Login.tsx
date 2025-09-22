import TravelLogin from "@/assets/images/travel-login.jpg";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 dark:text-white">Cabro</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <LoginForm className="w-full" />
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent z-10"></div>
        <img
          src={TravelLogin}
          alt="Cabro login"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-12">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-white border border-white/20 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Welcome to Cabro</h2>
            <p className="text-lg">
              Your premium ride-sharing experience begins here. Login to access exclusive
              features and start your journey with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}