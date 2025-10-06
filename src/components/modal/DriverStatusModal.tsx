import { AlertCircle, UserCheck, UserX } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DriverStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
  actionType: 'approve' | 'reject' | 'suspend' | 'reactivate';
  isLoading?: boolean;
}

export default function DriverStatusModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  driverName, 
  actionType,
  isLoading 
}: DriverStatusModalProps) {
  
  const getActionDetails = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Approve Driver Application',
          icon: <UserCheck className="h-5 w-5 text-green-600" />,
          description: `Are you sure you want to approve ${driverName}'s application? They will be able to accept ride requests immediately.`,
          confirmButtonText: 'Approve Driver',
          confirmButtonClass: 'bg-green-600 text-white hover:bg-green-700',
          cancelButtonText: 'Cancel'
        };
      case 'reject':
        return {
          title: 'Reject Driver Application',
          icon: <UserX className="h-5 w-5 text-red-600" />,
          description: `Are you sure you want to reject ${driverName}'s application? They will need to reapply with updated information.`,
          confirmButtonText: 'Reject Application',
          confirmButtonClass: 'bg-red-600 text-white hover:bg-red-700',
          cancelButtonText: 'Cancel'
        };
      case 'suspend':
        return {
          title: 'Suspend Driver',
          icon: <UserX className="h-5 w-5 text-amber-600" />,
          description: `Are you sure you want to suspend ${driverName}? They will not be able to accept new rides until reactivated.`,
          confirmButtonText: 'Suspend Driver',
          confirmButtonClass: 'bg-amber-600 text-white hover:bg-amber-700',
          cancelButtonText: 'Cancel'
        };
      case 'reactivate':
        return {
          title: 'Reactivate Driver',
          icon: <UserCheck className="h-5 w-5 text-green-600" />,
          description: `Are you sure you want to reactivate ${driverName}? They will be able to accept ride requests again.`,
          confirmButtonText: 'Reactivate Driver',
          confirmButtonClass: 'bg-green-600 text-white hover:bg-green-700',
          cancelButtonText: 'Cancel'
        };
      default:
        return {
          title: 'Confirm Action',
          icon: <AlertCircle className="h-5 w-5" />,
          description: `Are you sure you want to continue with this action for ${driverName}?`,
          confirmButtonText: 'Confirm',
          confirmButtonClass: 'bg-blue-600 text-white hover:bg-blue-700',
          cancelButtonText: 'Cancel'
        };
    }
  };

  const actionDetails = getActionDetails();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl z-[999] bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            {actionDetails.icon}
            {actionDetails.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            {actionDetails.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {actionDetails.cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className={actionDetails.confirmButtonClass}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : actionDetails.confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}