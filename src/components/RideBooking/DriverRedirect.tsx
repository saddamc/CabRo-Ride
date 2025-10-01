import { role } from '@/constants/role';
import { useUserInfoQuery } from '@/redux/features/auth/auth.api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DriverRedirect({ children }: { children: React.ReactNode }) {
  const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until we know if the user is logged in and their role
    if (!isLoading && userInfo?.data) {
      // If user is a driver, admin, or super_admin, redirect them away from the ride booking page
      if (
        userInfo.data.role === role.driver ||
        userInfo.data.role === role.admin ||
        userInfo.data.role === role.super_admin
      ) {
        toast.error('Drivers cannot access the ride booking page');
        
        // Redirect drivers to their dashboard
        if (userInfo.data.role === role.driver) {
          navigate('/driver');
        } else if (userInfo.data.role === role.admin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    }
  }, [userInfo, isLoading, navigate]);

  // Show nothing while checking if the user is a driver
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If the user is not a driver, render the children
  if (!userInfo?.data || (userInfo.data && userInfo.data.role !== role.driver)) {
    return <>{children}</>;
  }

  // Otherwise, render nothing (the redirect will happen in the useEffect)
  return null;
}