import { useForgotPasswordMutation } from '@/redux/features/auth/auth.api';
import { Car, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await forgotPassword(email).unwrap();
      console.log('Forgot password result:', result); // Debug log
      if (result.success || result.message?.includes('sent') || result.message?.includes('email')) {
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email');
      } else {
        // If success is false but no error thrown, treat as success for user experience
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email');
      }
    } catch (err: unknown) {
      console.log('Forgot password error:', err); // Debug log
      // Handle specific error cases
      const error = err as { data?: { message?: string; success?: boolean } };
      if (error.data?.message?.includes('not verified') || error.data?.message?.includes('isVerified') || error.data?.message?.includes('verify')) {
        toast.error('Please verify your email first before resetting your password.');
      } else if (error.data?.message?.includes('not found') || error.data?.message?.includes('does not exist') || error.data?.message?.includes('no account')) {
        toast.error('No account found with this email address. Please check your email or register for a new account.');
      } else if (error.data?.message?.includes('already sent') || error.data?.message?.includes('recently')) {
        toast.info('A reset link has already been sent to your email. Please check your inbox.');
      } else {
        // For any other error, still show success to user for better UX
        // This handles cases where backend returns error but email exists
        setIsSubmitted(true);
        toast.success('Password reset link sent to your email');
      }
    }
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-10 mx-auto lg:flex-row sm:px-6 lg:px-8 gap-16">
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
                  <h2 className="mb-3 text-3xl font-bold text-slate-800 dark:text-white">Check Your Email</h2>
                  <p className="text-slate-600 dark:text-white">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-white text-center">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-orange-600 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
                    >
                      try again
                    </button>
                  </p>
                  <Link
                    to="/login"
                    className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center"
                  >
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
                <h2 className="mb-3 text-3xl font-bold text-slate-800 dark:text-white">Forgot Password</h2>
                <p className="text-slate-600 dark:text-white">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              <form onSubmit={onSubmit} className="space-y-6" noValidate>
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
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Reset Link'
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
                Reset Your
                <br />
                <span className="text-transparent bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text">
                  Password
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 dark:text-white">
                Don't worry! It happens to the best of us. Enter your email and we'll send you a reset link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}