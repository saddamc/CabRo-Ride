// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { AlertCircle, X } from "lucide-react";
// import { useCallback, useEffect, useState } from 'react';

// // Component to check backend connectivity and alert user if there are issues
// const StatusChecker = () => {
//   const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');
//   const [showAlert, setShowAlert] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);
//   const [userDismissedAlert, setUserDismissedAlert] = useState(false);
//   const baseUrl = import.meta.env.VITE_BASE_URL;

//   // Function to check backend connectivity - wrapped in useCallback to prevent recreation on every render
//   const checkBackendStatus = useCallback(async () => {
//     // Skip check if user has dismissed the alert
//     if (userDismissedAlert) return;
    
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 8000); // Extended timeout to 8 seconds
      
//       setConnectionStatus('checking');
//       const healthEndpoint = `${baseUrl}/health`;
//       const fallbackEndpoint = `${baseUrl}`;
      
//       try {
//         // Try the health endpoint first
//         const response = await fetch(healthEndpoint, {
//           method: 'GET',
//           headers: { 'Accept': 'application/json' },
//           signal: controller.signal,
//           mode: 'cors', // Explicitly set CORS mode
//           credentials: 'include' // Include credentials if you're using cookies
//         });
//         clearTimeout(timeoutId);
        
//         if (response.ok) {
//           setConnectionStatus('online');
//           setShowAlert(false);
//           return;
//         }
//       } catch (error) {
//         console.log("Health endpoint check failed, trying fallback:", error);
//         // If health endpoint fails, try base URL as fallback
//         try {
//           const fallbackResponse = await fetch(fallbackEndpoint, {
//             method: 'GET',
//             headers: { 'Accept': 'application/json' },
//             signal: controller.signal,
//             mode: 'cors', // Explicitly set CORS mode
//             credentials: 'include' // Include credentials if you're using cookies
//           });
          
//           if (fallbackResponse.ok || fallbackResponse.status === 404) {
//             // 404 on base URL might mean the endpoint doesn't exist but server is running
//             setConnectionStatus('online');
//             setShowAlert(false);
//             return;
//           }
//         } catch (error) {
//           // Both attempts failed
//           console.error("Backend connectivity check failed:", error);
          
//           // Assume online if we're in production and the error is likely CORS-related
//           const isProdEnvironment = window.location.hostname !== 'localhost';
//           const isCorsError = error instanceof TypeError && error.message.includes('Failed to fetch');
          
//           if (isProdEnvironment && isCorsError) {
//             console.log("Likely CORS error in production - assuming backend is online");
//             setConnectionStatus('online');
//             setShowAlert(false);
//             return;
//           }
//         }
//       }
      
//       // If we reach here, both checks failed
//       setConnectionStatus('offline');
//       setShowAlert(true);
      
//     } catch (error) {
//       console.error("Backend status check error:", error);
//       setConnectionStatus('offline');
//       setShowAlert(true);
//     }
//   }, [baseUrl, userDismissedAlert]);

//   // Retry connection on button click
//   const handleRetry = () => {
//     setRetryCount(prev => prev + 1);
//     checkBackendStatus();
//   };

//   // Check connectivity on mount and when retryCount changes
//   useEffect(() => {
//     // Initial check
//     checkBackendStatus();
    
//     // Set up periodic checking with longer interval to reduce API load
//     const intervalId = setInterval(() => {
//       checkBackendStatus();
//     }, 60000); // Check every minute instead of every 30 seconds
    
//     return () => clearInterval(intervalId);
//   }, [retryCount, checkBackendStatus]); // Include checkBackendStatus in dependencies

//   if (!showAlert) {
//     return null;
//   }

//   return (
//     <Alert 
//       variant="destructive"
//       className="fixed bottom-4 right-4 w-auto max-w-md z-50 flex items-center justify-between"
//     >
//       <div className="flex items-center gap-2">
//         <AlertCircle className="h-4 w-4" />
//         <div>
//           <AlertTitle>Connection Error</AlertTitle>
//           <AlertDescription>
//             Cannot connect to the backend server. Please check your internet connection or server status.
//           </AlertDescription>
//         </div>
//       </div>
//       <div className="flex gap-2 ml-4">
//         <Button size="sm" variant="outline" onClick={handleRetry}>
//           {connectionStatus === 'checking' ? 'Checking...' : 'Retry'}
//         </Button>
//         <Button 
//           size="icon" 
//           variant="ghost" 
//           onClick={() => {
//             setShowAlert(false);
//             setUserDismissedAlert(true); // Remember user dismissed the alert
//           }}
//         >
//           <X className="h-4 w-4" />
//         </Button>
//       </div>
//     </Alert>
//   );
// };

// export default StatusChecker;