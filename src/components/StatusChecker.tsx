import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from 'react';

// Component to check backend connectivity and alert user if there are issues
const StatusChecker = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [showAlert, setShowAlert] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Function to check backend connectivity
  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      setConnectionStatus('checking');
      const healthEndpoint = `${baseUrl}/health`;
      const fallbackEndpoint = `${baseUrl}`;
      
      try {
        // Try the health endpoint first
        const response = await fetch(healthEndpoint, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setConnectionStatus('online');
          setShowAlert(false);
          return;
        }
      } catch {
        // If health endpoint fails, try base URL as fallback
        try {
          const fallbackResponse = await fetch(fallbackEndpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
          });
          
          if (fallbackResponse.ok || fallbackResponse.status === 404) {
            // 404 on base URL might mean the endpoint doesn't exist but server is running
            setConnectionStatus('online');
            setShowAlert(false);
            return;
          }
        } catch (error) {
          // Both attempts failed
          console.error("Backend connectivity check failed:", error);
        }
      }
      
      // If we reach here, both checks failed
      setConnectionStatus('offline');
      setShowAlert(true);
      
    } catch (error) {
      console.error("Backend status check error:", error);
      setConnectionStatus('offline');
      setShowAlert(true);
    }
  };

  // Retry connection on button click
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    checkBackendStatus();
  };

  // Check connectivity on mount and when retryCount changes
  useEffect(() => {
    checkBackendStatus();
    
    // Set up periodic checking
    const intervalId = setInterval(() => {
      checkBackendStatus();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [retryCount]);

  if (!showAlert) {
    return null;
  }

  return (
    <Alert 
      variant="destructive"
      className="fixed bottom-4 right-4 w-auto max-w-md z-50 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <div>
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            Cannot connect to the backend server. Please check your internet connection or server status.
          </AlertDescription>
        </div>
      </div>
      <div className="flex gap-2 ml-4">
        <Button size="sm" variant="outline" onClick={handleRetry}>
          {connectionStatus === 'checking' ? 'Checking...' : 'Retry'}
        </Button>
        <Button size="icon" variant="ghost" onClick={() => setShowAlert(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};

export default StatusChecker;