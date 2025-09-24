import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Lazy load components for better code splitting
const App = lazy(() => import("@/App"));
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));
const RoleDashboard = lazy(() => import("@/components/layout/RoleDashboard"));
const GoogleCallback = lazy(() => import("@/components/modules/Authentication/GoogleCallback"));

const About = lazy(() => import("@/pages/About"));
const BookRide = lazy(() => import("@/pages/BookRide")); // Universal book ride page for any role
const Contact = lazy(() => import("@/pages/Contact"));
// Removed: DriverBookRide (now handled by RideBooking)
const DriverDashboard = lazy(() => import("@/pages/Driver/Dashboard"));
const DriverRideHistory = lazy(() => import("@/pages/Driver/RideHistory"));
const DriverWallet = lazy(() => import("@/pages/Driver/Wallet"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Features = lazy(() => import("@/pages/Features"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const Home = lazy(() => import("@/pages/Home/Home"));
const Login = lazy(() => import("@/pages/Login"));
const Fail = lazy(() => import("@/pages/Payment/Fail"));
const Success = lazy(() => import("@/pages/Payment/Success"));
const Profile = lazy(() => import("@/pages/Profile"));
const Register = lazy(() => import("@/pages/Register"));
// Removed: RiderBookRide (now handled by RideBooking)
const RiderDashboard = lazy(() => import("@/pages/Rider/Dashboard"));
const RideBooking = lazy(() => import("@/pages/Rider/RideBooking"));
const RideHistory = lazy(() => import("@/pages/Rider/RideHistory"));
const StartRide = lazy(() => import("@/pages/Rider/StartRide"));
const Unauthorized = lazy(() => import("@/pages/Unauthorized"));
// Universal booking is imported directly in BookRide component
const Wallet = lazy(() => import("@/pages/User/Wallet"));
const Verify = lazy(() => import("@/pages/Verify"));

import { role } from "@/constants/role";
import type { TRole } from "@/types";
import generateRoutes from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";



export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                // Revert to the original approach for now to get things working
                Component: Home,
                index: true,
            },
            {
                Component: About,
                path: "about",
            },
            {
                Component: Features,
                path: "features",
            },
            {
                Component: Contact,
                path: "contact",
            },
            {
                Component: FAQ,
                path: "faq",
            },
            // {
            //     Component: Tours,
            //     path: "tours",
            // },
            // {
            //     Component: TourDetails,
            //     path: "tours/:id",
            // },
            // {
            //     Component: withAuth(Booking),
            //     path: "booking/:id",
            // },
        ]
    },
    {
        // Allow both super_admin and admin roles to access the admin dashboard
        Component: withAuth(DashboardLayout, [role.super_admin, role.admin] as TRole[]),
        path: "/admin",
        children: [{index: true, element: <Navigate to="/admin/analytics" />},...generateRoutes(adminSidebarItems)       ]
    },
    {
        Component: withAuth(DashboardLayout, role.user as TRole),
        path: "/user",
        children: [{index: true, element: <Navigate to="/user/bookings" />},...generateRoutes(userSidebarItems) ]
    },
    {
        Component: Login,
        path: "/login",
    },
    {
        Component: Register,
        path: "/register",
    },
    {
        Component: ForgotPassword,
        path: "/forgot-password",
    },
    {
        Component: Profile,
        path: "/profile",
    },
    {
        Component: withAuth(Wallet, role.user as TRole),
        path: "/wallet",
    },
    // Rider Routes
    {
        Component: withAuth(RoleDashboard, role.user as TRole),
        path: "/rider",
        children: [
            {
                index: true,
                element: <RiderDashboard />
            },
            {
                path: "dashboard",
                element: <RiderDashboard />
            },
            {
                path: "book-ride",
                element: <RideBooking />
            },
            {
                path: "start-ride",
                element: <StartRide />
            },
            {
                path: "ride-booking",
                element: <RideBooking />
            },
            {
                path: "history",
                element: <RideHistory />
            },
            {
                path: "wallet",
                element: <Wallet />
            }
        ]
    },
    // Driver Routes
    {
        Component: withAuth(RoleDashboard, role.driver as TRole),
        path: "/driver",
        children: [
            {
                index: true,
                element: <DriverDashboard />
            },
            {
                path: "dashboard",
                element: <DriverDashboard />
            },
            {
                path: "book-ride",
                element: <RideBooking />
            },
            {
                path: "history",
                element: <DriverRideHistory />
            },
            {
                path: "wallet",
                element: <DriverWallet />
            },
            {
                path: "fleet",
                element: <DriverWallet />
            }
        ]
    },
    {
        Component: Verify,
        path: "/verify",
    },
    {
        Component: Unauthorized,
        path: "/unauthorized",
    },
    {
        // Universal book ride route - accessible to all roles without authorization checks
        Component: BookRide,
        path: "/book-ride",
    },
    {
        Component: Success,
        path: "/payment/success",
    },
    {
        Component: Fail,
        path: "/payment/fail",
    },
    {
        Component: GoogleCallback,
        path: "/auth/google/callback",
    },

])