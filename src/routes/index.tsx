import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GoogleCallback from "@/components/modules/Authentication/GoogleCallback";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Features from "@/pages/Features";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Fail from "@/pages/Payment/Fail";
import Success from "@/pages/Payment/Success";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import Unauthorized from "@/pages/Unauthorized";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import generateRoutes from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
;



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