import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Ban, CheckCircle2, Shield } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../ui/button";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  selectedStatus?: string;
  actionType?: string;
  statusOptions?: { value: string; label: string }[];
  onStatusChange?: (status: string) => void;
  isLoading?: boolean;
  targetName?: string;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  selectedStatus: propSelectedStatus,
  actionType,
  statusOptions,
  onStatusChange,
  isLoading = false,
  targetName,
}: ConfirmationModalProps) {
  const selectedStatus = propSelectedStatus || actionType || '';

  // Configure icon and colors based on selected status
  const getIconAndColor = (): { icon: ReactNode; colorClass: string } => {
    switch (selectedStatus) {
      case 'BLOCKED':
        return {
          icon: <Ban className="h-8 w-8 text-red-500" />,
          colorClass: 'border-red-200 bg-red-50'
        };
      case 'INACTIVE':
        return {
          icon: <Shield className="h-8 w-8 text-yellow-500" />,
          colorClass: 'border-yellow-200 bg-yellow-50'
        };
      case 'ACTIVE':
        return {
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          colorClass: 'border-green-200 bg-green-50'
        };
      default:
        return {
          icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
          colorClass: 'border-yellow-200 bg-yellow-50'
        };
    }
  };

  const { icon, colorClass } = getIconAndColor();

  // Configure button colors based on selected status
  const getButtonColor = (): string => {
    switch (selectedStatus) {
      case 'BLOCKED':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'INACTIVE':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'ACTIVE':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl z-[999] bg-gray-800/90 backdrop-blur-lg border border-gray-600 text-white">
        <AlertDialogHeader>
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 mb-4 mt-4 p-2 ring-4 ring-white ${colorClass}`}>
            {icon}
          </div>
          <AlertDialogTitle className="text-center text-lg font-semibold">{title}</AlertDialogTitle>
          {statusOptions && onStatusChange && (
            <div className="flex justify-center mt-4">
              <Select value={selectedStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 z-[1000]">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-600">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <AlertDialogDescription className="text-center pt-2">
            {targetName ? (
              <>
                Change {targetName}'s status to <span className="font-medium">{selectedStatus}</span>.
                <br />
                {description}
              </>
            ) : (
              description
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className={`flex-1 ${getButtonColor()} text-white`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : `Confirm ${selectedStatus}`}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}