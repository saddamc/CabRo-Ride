import { useRegisterMutation } from '@/redux/features/auth/auth.api';
import { Car, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [register] = useRegisterMutation();

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await register({ name, email, password }).unwrap();
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/login');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Registration failed');
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
