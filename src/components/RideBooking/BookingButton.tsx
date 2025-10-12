import { useToast } from '@/components/ui/use-toast';
import { role } from '@/constants/role';
import React from 'react';

interface BookingButtonProps {
  userInfo: {
    data?: {
      role?: string;
    };
  } | null | undefined;
  handleReset: () => void;
  handleRequestRide: () => void;
  isRequestingRide: boolean;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  userInfo,
  handleReset,
  handleRequestRide,
  isRequestingRide
}) => {
  const { toast } = useToast();

  const isRestrictedRole = userInfo?.data?.role === role.driver || 
                          userInfo?.data?.role === role.admin || 
                          userInfo?.data?.role === role.super_admin;
  
  const checkRoleAndBook = () => {
    if (isRestrictedRole) {
      toast({
        title: 'Access Denied',
        description: 'Drivers, admins, and super admins cannot book rides.',
        variant: 'destructive',
      });
      return;
    }
    
    handleRequestRide();
  };

  return (
    <div className="p-4 bg-white border-t">
      {isRestrictedRole ? (
        <div className="text-center py-4">
          <div className="text-gray-500 mb-2">
            🚫 {userInfo?.data?.role === role.driver ? 'Drivers' : userInfo?.data?.role === role.admin ? 'Admins' : 'Super Admins'} cannot book rides
          </div>
          <div className="text-sm text-gray-400">
            This feature is only available for regular users. You can still view routes and fares.
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={handleReset}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md hover:bg-gray-800 disabled:opacity-50"
            onClick={checkRoleAndBook}
            disabled={isRequestingRide}
          >
            {isRequestingRide ? 'Requesting...' : 'Book Now'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingButton;