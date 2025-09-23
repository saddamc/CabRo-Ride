import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleDashboard from "@/components/layout/RoleDashboard";
import GoogleCallback from "@/components/modules/Authentication/GoogleCallback";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import DriverBookRide from "@/pages/Driver/BookRide";
import DriverDashboard from "@/pages/Driver/Dashboard";
import DriverRideHistory from "@/pages/Driver/RideHistory";
import DriverWallet from "@/pages/Driver/Wallet";
import FAQ from "@/pages/FAQ";
import Features from "@/pages/Features";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login";
import Fail from "@/pages/Payment/Fail";
import Success from "@/pages/Payment/Success";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import BookRide from "@/pages/Rider/BookRide";
import RiderDashboard from "@/pages/Rider/Dashboard";
import RideHistory from "@/pages/Rider/RideHistory";
import StartRide from "@/pages/Rider/StartRide";
import Unauthorized from "@/pages/Unauthorized";
import Wallet from "@/pages/User/Wallet";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import generateRoutes from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router-dom";
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
        Component: withAuth(DashboardLayout, role.superAdmin as TRole),
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
                element: <BookRide />
            },
            {
                path: "start-ride",
                element: <StartRide />
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
                element: <DriverBookRide />
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