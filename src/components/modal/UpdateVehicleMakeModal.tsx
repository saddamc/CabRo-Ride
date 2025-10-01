import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Car, Loader2 } from "lucide-react";
import { useState } from "react";

interface UpdateVehicleMakeModalProps {
  currentMake: string;
  isLoading: boolean;
  onConfirm: (newMake: string) => Promise<void>;
  children: React.ReactNode;
}

export default function UpdateVehicleMakeModal({
  currentMake,
  isLoading,
  onConfirm,
  children
}: UpdateVehicleMakeModalProps) {
  const [newMake, setNewMake] = useState(currentMake);

  const handleConfirm = async () => {
    if (newMake.trim() && newMake !== currentMake) {
      await onConfirm(newMake.trim());
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Car className="h-5 w-5" />
            Update Vehicle Make
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            Update your vehicle's make information. This will be reflected in your profile and ride requests.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor="vehicleMake" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Vehicle Make
            </label>
            <Input
              id="vehicleMake"
              value={newMake}
              onChange={(e) => setNewMake(e.target.value)}
              placeholder="Enter vehicle make"
              disabled={isLoading}
              className="w-full"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading || !newMake.trim() || newMake === currentMake}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Car className="h-4 w-4 mr-2" />
                Update Make
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}