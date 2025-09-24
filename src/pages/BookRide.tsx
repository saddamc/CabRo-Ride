import LoadingFallback from '@/components/LoadingFallback';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import components lazily
const UniversalRideBooking = lazy(() => import('@/pages/UniversalRideBooking'));

// This is a universal book ride page that handles different roles
// without redirecting to protected routes that might cause unauthorized errors
const BookRide = () => {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  // If not logged in and done loading, redirect to login
  useEffect(() => {
    if (!isLoading && !userInfo?.data) {
      navigate('/login', { state: { from: '/book-ride' } });
    }
  }, [userInfo, isLoading, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }

  // If not logged in, don't render anything (the effect will redirect)
  if (!userInfo?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingFallback />
      </div>
    );
  }

  // Render different components based on role directly in this component
  // instead of redirecting to role-protected routes
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UniversalRideBooking />
    </Suspense>
  );
};

export default BookRide;