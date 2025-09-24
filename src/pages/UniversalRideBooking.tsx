import LoadingFallback from '@/components/LoadingFallback';
import { lazy, Suspense } from 'react';

// Lazy load the actual booking component
const RideBookingComponent = lazy(() => import('@/pages/Rider/RideBooking'));

// This component is a wrapper that doesn't use role-based access control
// so it can be used by both riders and admins without unauthorized errors
const UniversalRideBooking = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RideBookingComponent />
    </Suspense>
  );
};

export default UniversalRideBooking;