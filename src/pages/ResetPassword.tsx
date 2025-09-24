import { Car, Eye, EyeOff, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  const userId = searchParams.get('id');
  const token = searchParams.get('token');

  useEffect(() => {
    // Validate that both id and token are present
    if (!userId || !token) {
      setIsValidToken(false);
      toast.error('The password reset link is invalid or expired.');
    }
  }, [userId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Please make sure both passwords are the same.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Here you would call your API to reset the password
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          token,
          newPassword: password,
        }),
      });

      if (response.ok) {
        toast.success('Your password has been reset successfully.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-10 mx-auto lg:flex-row sm:px-6 lg:px-8 gap-16">
          {/* Invalid Link Message */}
          <div className="z-10 w-full max-w-md">
            <div className="relative overflow-hidden border shadow-2xl bg-white/90 backdrop-blur-xl rounded-3xl dark:bg-slate-900/90 border-white/20">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <div className="p-8">
                <div className="flex justify-center mb-8">
                  <div className="flex items-center gap-2">
                    <div className="p-2 shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-transparent bg-gradient-to-r from-red-600 to-red-500 bg-clip-text">
                      Cabro Ride
                    </span>
                  </div>
                </div>
                <div className="mb-8 text-center">
                  <h2 className="mb-3 text-3xl font-bold text-red-600 dark:text-red-400">Invalid Reset Link</h2>
                  <p className="text-slate-600 dark:text-white">The password reset link is invalid or has expired.</p>
                </div>
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Request New Reset Link
                </button>
                <div className="mt-6 text-center">
                  <Link to="/login" className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="mb-3 text-3xl font-bold text-slate-800 dark:text-white">Reset Your Password</h2>
                <p className="text-slate-600 dark:text-white">Enter your new password below. Make sure it's secure and easy to remember.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-slate-700 dark:text-white">New Password</div>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 pl-10 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Enter new password"
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
                  <div className="text-sm font-medium text-slate-700 dark:text-white">Confirm New Password</div>
                  <div className="relative">
                    <Lock className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full py-3 pl-10 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-800 dark:text-white"
                      placeholder="Confirm new password"
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
                      <span>Resetting Password...</span>
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-white">
                    Remember your password? <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300">Sign in</Link>
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
                Secure Your Account
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 dark:text-white">
                Create a strong password to keep your account safe and secure for all your rides.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}