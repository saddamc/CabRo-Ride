import { useLoginMutation } from '@/redux/features/auth/auth.api';
import { initiateGoogleLogin } from '@/utils/googleAuth';
import { Car, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/";
  const locationData = location.state?.locationData;
  const useCurrentLocation = location.state?.useCurrentLocation;
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({ email, password }).unwrap();
      if (result.success) {
        if (result.data.user && !result.data.user.isVerified) {
          toast.info("Your account needs verification");
          navigate("/verify", { state: email });
        } else {
          toast.success("Logged in successfully");
          
          // Check for stored redirect first (from navbar)
          const storedRedirect = localStorage.getItem('redirectAfterLogin');
          if (storedRedirect) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(storedRedirect);
          }
          // Handle redirect with location data if present
          else if (redirectPath.includes('ride-booking')) {
            navigate(redirectPath, { 
              state: { 
                selectedLocation: locationData,
                useCurrentLocation: useCurrentLocation 
              } 
            });
          } else if (result.data.redirectTo) {
            navigate(result.data.redirectTo);
          } else {
            navigate(redirectPath);
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-10 mx-auto lg:flex-row sm:px-6 lg:px-8 gap-16">
        {/* Left Side - Form */}
        <div className="z-10 w-full max-w-md">
          <div className="relative overflow-hidden border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl dark:bg-slate-900/90 border-white/20">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500"></div>
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="p-2 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text">
                    Cabro Ride
                  </span>
                </div>
              </div>
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-3xl font-bold text-slate-800 dark:text-white">Welcome Back</h2>
                <p className="text-slate-600 dark:text-white">Sign in to your account</p>
              </div>
              <form onSubmit={onLogin} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Email Address</div>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-10 pr-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Password</div>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 pl-10 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="relative flex items-center justify-center mt-2">
                  <div className="absolute w-full border-t border-gray-300 dark:border-gray-700"></div>
                  <div className="relative px-4 text-sm text-gray-500 bg-white dark:bg-slate-900 dark:text-gray-400">Or continue with</div>
                </div>

                <button
                  type="button"
                  onClick={() => initiateGoogleLogin()}
                  className="flex items-center justify-center w-full py-3 px-4 bg-white border border-gray-300 rounded-xl font-medium text-slate-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-white">
                    Don't have an account? <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">Sign up</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Right Side - Branding */}
        <div className="flex-col justify-center flex-1 hidden max-w-lg space-y-8 lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text">
                Cabro Ride
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight lg:text-5xl text-slate-800 dark:text-white">
                Welcome Back to
                <br />
                <span className="text-transparent bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text">
                  Cabro Ride
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 dark:text-white">
                Sign in to your account and continue your journey with safe, reliable, and affordable rides.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}