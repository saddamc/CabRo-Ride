import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Accepts a single role or an array of roles
export const withAuth = (Component: ComponentType, requiredRole?: TRole | TRole[]) => {
    return function AuthWrapper() {
        const { data, isLoading } = useUserInfoQuery(undefined);
        const location = useLocation();

        // Show component while loading to prevent flashing
        if (isLoading) {
            return <Component />;
        }

        // If user is not logged in, redirect to login
        if (!data?.data?.email) {
            return <Navigate to="/login" />;
        }

        // If role is required but user doesn't have it, redirect to unauthorized
        if (requiredRole) {
            const userRole = data?.data?.role;
            if (Array.isArray(requiredRole)) {
                if (!requiredRole.includes(userRole)) {
                    return <Navigate to="/unauthorized" />;
                }
            } else {
                if (requiredRole !== userRole) {
                    return <Navigate to="/unauthorized" />;
                }
            }
        }

        // If user is not verified and not on verify page, redirect to verify
        if (!data?.data?.isVerified && !location.pathname.includes('/verify')) {
            return <Navigate to="/verify" />;
        }

        // All checks passed
        return <Component />;
    }
}