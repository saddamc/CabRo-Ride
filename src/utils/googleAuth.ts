import config from '@/config';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const initiateGoogleLogin = () => {
  try {
    // Show loading toast
    toast.loading('Connecting to Google...', {
      duration: 5000, // Keep it visible for 5 seconds (though redirect will happen sooner)
    });
    
    // Delay redirect slightly to ensure toast is visible
    setTimeout(() => {
      // Redirect to the Google auth endpoint
      window.location.href = `${config.baseUrl}/auth/google`;
    }, 800); // 800ms delay gives the toast time to appear
  } catch (error) {
    // Show error toast if something goes wrong
    toast.error('Failed to connect to Google. Please try again.');
    console.error('Google login error:', error);
  }
};

export const useHandleGoogleCallback = (
  isLoading: boolean,
  isAuthenticated: boolean,
  isVerified: boolean | undefined,
  redirectPath: string = '/',
  error?: unknown
) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any existing loading toasts when component first mounts
    // This ensures we don't have stale loading toasts from the previous redirect
    if (!isAuthenticated && !error) {
      toast.dismiss();
      
      // Show a new loading toast to indicate we're processing the callback
      toast.loading('Finalizing login...', { 
        duration: 5000,
        id: 'google-auth-callback' 
      });
    }
    
    // Handle authentication success
    if (!isLoading && isAuthenticated) {
      // Dismiss all toasts including loading ones
      toast.dismiss();
      
      // Show success notification
      toast.success('Logged in successfully with Google', { 
        duration: 3000,
        id: 'google-auth-success' 
      });
      
      // Redirect based on verification status
      setTimeout(() => {
        if (isVerified === false) {
          navigate('/verify');
        } else {
          navigate(redirectPath);
        }
      }, 500); // Short delay to allow the success toast to be seen
    } 
    // Handle authentication error
    else if (!isLoading && !isAuthenticated && (error || document.location.search.includes('error'))) {
      // Dismiss all toasts including loading ones
      toast.dismiss();
      
      // Show error notification
      toast.error('Google login failed. Please try again or use email login.', {
        duration: 4000,
        id: 'google-auth-error'
      });
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Longer delay to ensure error message is read
    }
  }, [isLoading, isAuthenticated, isVerified, navigate, redirectPath, error]);

  return null;
};