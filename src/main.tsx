import React, { Suspense } from "react";
import ReactDom from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingFallback from "./components/LoadingFallback.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { ThemeProvider } from "./providers/theme.provider.tsx";
import { store } from "./redux/store.ts";
import { router } from "./routes/index.tsx";

ReactDom.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Suspense fallback={<LoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster richColors position="top-center" closeButton toastOptions={{
            style: { 
              // background: 'white', 
              // color: '#333',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              padding: '16px 20px'
            }
          }}/>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
