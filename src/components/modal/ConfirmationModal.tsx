import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Ban, CheckCircle2, Shield, X } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: 'block' | 'suspend' | 'reactivate' | 'approve' | 'reject';
  isLoading?: boolean;
  targetName?: string;
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType,
  isLoading = false,
  targetName,
}: ConfirmationModalProps) {
  // Configure icon and colors based on action type
  const getIconAndColor = (): { icon: ReactNode; colorClass: string } => {
    switch (actionType) {
      case 'block':
        return { 
          icon: <Ban className="h-8 w-8 text-red-500" />,
          colorClass: 'border-red-200 bg-red-50'
        };
      case 'suspend':
        return { 
          icon: <Shield className="h-8 w-8 text-yellow-500" />, 
          colorClass: 'border-yellow-200 bg-yellow-50'
        };
      case 'approve':
        return { 
          icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
          colorClass: 'border-green-200 bg-green-50'
        };
      case 'reject':
        return { 
          icon: <X className="h-8 w-8 text-red-500" />,
          colorClass: 'border-red-200 bg-red-50'
        };
      case 'reactivate':
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

  // Configure button colors based on action type
  const getButtonColor = (): string => {
    switch (actionType) {
      case 'block':
      case 'reject':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'suspend':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'approve':
      case 'reactivate':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 mb-4 mt-4 p-2 ring-4 ring-white"
            className={colorClass}
          >
            {icon}
          </div>
          <DialogTitle className="text-center text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {targetName ? (
              <>
                You are about to <span className="font-medium">{actionType}</span> {targetName}.
                <br />
                {description}
              </>
            ) : (
              description
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
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
            {isLoading ? "Processing..." : `Confirm ${actionType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}