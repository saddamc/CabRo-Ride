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
import { Car, Loader2 } from "lucide-react";

interface SetOnlineModalProps {
  isOnline: boolean;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  children: React.ReactNode;
}

export default function SetOnlineModal({ isOnline, isLoading, onConfirm, children }: SetOnlineModalProps) {
  const buttonStyles = isOnline
    ? "bg-red-600 text-white hover:bg-red-700"
    : "bg-green-600 text-white hover:bg-green-700";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white/60 backdrop-blur-lg border border-gray-200 dark:bg-gray-900/60 dark:border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Car className="h-5 w-5" />
            {isOnline ? "Go Offline" : "Go Online"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
            {isOnline
              ? "Going offline will stop you from receiving new ride requests. You can still complete any active rides."
              : "Going online will allow you to receive new ride requests and start accepting rides."
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={buttonStyles}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Car className="h-4 w-4 mr-2" />
                {isOnline ? "Go Offline" : "Go Online"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
