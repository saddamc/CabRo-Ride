import config from '@/config';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const initiateGoogleLogin = () => {
  // Redirect to the Google auth endpoint
  window.location.href = `${config.baseUrl}/auth/google`;
};

export const useHandleGoogleCallback = (
  isLoading: boolean,
  isAuthenticated: boolean,
  isVerified: boolean | undefined,
  redirectPath: string = '/'
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Show success notification
      toast.success('Logged in successfully with Google');
      
      // Redirect based on verification status
      if (isVerified === false) {
        navigate('/verify');
      } else {
        navigate(redirectPath);
      }
    }
  }, [isLoading, isAuthenticated, isVerified, navigate, redirectPath]);

  return null;
};