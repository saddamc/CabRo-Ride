import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { Navigate } from 'react-router-dom';

interface AuthBlockerProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthBlocker({ children, redirectTo = '/' }: AuthBlockerProps) {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect them away from this route
  if (userInfo?.data) {
    return <Navigate to={redirectTo} replace />;
  }

  // If user is not authenticated, allow access to the children
  return <>{children}</>;
}