import { Button } from "@/components/ui/button";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  // Method to reset the error boundary
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Check if error is related to backend connection
      const isConnectionError = 
        this.state.error?.message?.includes('Failed to fetch') || 
        this.state.error?.message?.includes('Network Error') ||
        this.state.error?.toString().includes('TypeError: Failed to fetch');
      
      // If there's a custom fallback, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Otherwise, render default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-red-500 text-4xl">!</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isConnectionError 
              ? "Connection Error" 
              : "Something went wrong"}
          </h1>
          <div className="max-w-md mb-6 text-gray-600">
            {isConnectionError ? (
              <p>
                We couldn't connect to our servers. This could be due to:
                <ul className="list-disc text-left pl-8 mt-2">
                  <li>Your internet connection</li>
                  <li>Our server might be down for maintenance</li>
                  <li>The API endpoint configuration might be incorrect</li>
                </ul>
              </p>
            ) : (
              <p>
                {this.state.error?.toString() || "An unexpected error occurred"}
              </p>
            )}
          </div>
          <div className="flex gap-4">
            <Button onClick={this.resetErrorBoundary} variant="default">
              Try Again
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload Page
            </Button>
          </div>
          
          {/* Collapsible section for developers */}
          <details className="mt-8 text-left w-full max-w-xl border border-gray-200 rounded-md p-2">
            <summary className="cursor-pointer p-2 text-sm font-medium">
              Technical Details (for developers)
            </summary>
            <div className="p-4 bg-gray-50 rounded-md mt-2 text-xs overflow-auto">
              <h3 className="font-mono font-bold">Error:</h3>
              <pre className="whitespace-pre-wrap break-all">
                {this.state.error?.toString()}
              </pre>
              
              <h3 className="font-mono font-bold mt-4">Component Stack:</h3>
              <pre className="whitespace-pre-wrap break-all">
                {this.state.errorInfo?.componentStack}
              </pre>
              
              <h3 className="font-mono font-bold mt-4">API URL:</h3>
              <pre className="whitespace-pre-wrap break-all">
                {import.meta.env.VITE_BASE_URL || "Not configured"}
              </pre>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;