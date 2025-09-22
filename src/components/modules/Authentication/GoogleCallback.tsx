import { FullScreenLoading } from '@/components/ui/Loading';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useHandleGoogleCallback } from '@/utils/googleAuth';
import { useSearchParams } from 'react-router-dom';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const { data, isLoading } = useUserInfoQuery(undefined);
  
  // Get state parameter from URL (for redirection)
  const state = searchParams.get('state') || '/';
  
  // Get user's verification status
  const isVerified = data?.data?.isVerified;
  const isAuthenticated = !!data?.data?.email;
  
  // Use the hook to handle authentication flow
  useHandleGoogleCallback(isLoading, isAuthenticated, isVerified, state);

  return (
    <div className="h-screen flex items-center justify-center">
      <FullScreenLoading 
        text="Completing your login..." 
        variant="spinner" 
        size="lg" 
        color="primary"
      />
    </div>
  );
};

export default GoogleCallback;