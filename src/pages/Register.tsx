import { useRegisterMutation } from '@/redux/features/auth/auth.api';
import { initiateGoogleLogin } from '@/utils/googleAuth';
import { Car, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define User role types
type UserRole = 'rider' | 'driver';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('rider');
  const [isLoading, setIsLoading] = useState(false);
  const [register] = useRegisterMutation();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await register({ name, email, password, role }).unwrap();
      if (result.success) {
        // Show different message based on role
        if (role === 'driver') {
          toast.success('Driver registration successful! You can now log in and complete your driver profile.');
        } else {
          toast.success('Registration successful!');
        }
        navigate('/login');
      }
    } catch (err: unknown) {
      console.error('Registration error:', err);
      
      // Type assertion and improved error handling
      const error = err as { 
        data?: { message?: string; success?: boolean; error?: string }, 
        status?: number 
      };
      
      // Handle specific error cases
      if (error.status === 409) {
        if (error.data?.message?.includes('email')) {
          toast.error(`An account with email ${email} already exists. Please use a different email or log in.`);
        } else if (error.data?.message?.includes('plate') || error.data?.error?.includes('plate')) {
          toast.error('Vehicle plate number is already registered. Please use a different plate number.');
        } else {
          toast.error(error.data?.message || 'A duplicate entry was detected. Please try again with different information.');
        }
      } else if (error.status === 400) {
        toast.error(error.data?.message || 'Please check your information and try again.');
      } else {
        toast.error(error.data?.message || 'Registration failed. Please try again later.');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-10 mx-auto lg:flex-row sm:px-6 lg:px-8 gap-16">
        {/* Left Side - Branding */}
        <div className="flex-col justify-center flex-1 hidden max-w-lg space-y-8 lg:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text">
                Cabro
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight lg:text-5xl text-slate-800 dark:text-white">
                Join the Future of
                <br />
                <span className="text-transparent bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text">
                  Transportation
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 dark:text-white">
                Create your account and start your journey with safe, reliable, and affordable rides.
              </p>
            </div>
          </div>
        </div>
        {/* Right Side - Register Form */}
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
                    Cabro
                  </span>
                </div>
              </div>
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-3xl font-bold text-slate-800 dark:text-white">Create Account</h2>
                <p className="text-slate-600 dark:text-white">Join thousands of satisfied riders and drivers</p>
              </div>
              <form onSubmit={onRegister} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Name</div>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-3 pl-4 pr-4 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Enter your name"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
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
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Role</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                        role === 'rider' 
                        ? 'border-orange-500 bg-orange-50 dark:bg-slate-800 ring-2 ring-orange-500' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setRole('rider')}
                    >
                      <div className="flex flex-col items-center">
                        <Car className={`w-6 h-6 mb-1 ${role === 'rider' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`} />
                        <span className={`text-sm font-medium ${role === 'rider' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>Rider</span>
                      </div>
                    </div>
                    <div 
                      className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                        role === 'driver' 
                        ? 'border-orange-500 bg-orange-50 dark:bg-slate-800 ring-2 ring-orange-500' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-slate-800'
                      }`}
                      onClick={() => setRole('driver')}
                    >
                      <div className="flex flex-col items-center">
                        <svg 
                          className={`w-6 h-6 mb-1 ${role === 'driver' ? 'text-orange-500' : 'text-slate-500 dark:text-slate-400'}`} 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2c-4 0-8 .5-8 4v9.5c0 .95.37 1.89 1.03 2.6c.63-.71 1.5-1.16 2.47-1.16c.77 0 1.5.27 2.1.72c-1.25 1.41-.67 2.34-.1 3.34H8c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2h-1.5c.57-1 1.15-1.93-.1-3.34c.59-.45 1.32-.72 2.1-.72c.97 0 1.84.45 2.47 1.16c.66-.71 1.03-1.65 1.03-2.6V6c0-3.5-3.58-4-8-4zm2.5 8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm-5 0c-.83 0-1.5-.67-1.5-1.5S8.67 6.5 9.5 6.5S11 7.17 11 8s-.67 1.5-1.5 1.5z" />
                        </svg>
                        <span className={`text-sm font-medium ${role === 'driver' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>Driver</span>
                      </div>
                    </div>
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
                      autoComplete="new-password"
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
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Confirm Password</div>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-3 pl-10 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Confirm your password"
                      required
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Sign Up'
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
                  Sign up with Google
                </button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-white">
                    Already have an account? <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">Sign in</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
