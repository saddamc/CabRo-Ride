import App from "@/App";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { role } from "@/constants/role";
import About from "@/pages/About";
import Booking from "@/pages/Booking";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import Fail from "@/pages/Payment/Fail";
import Success from "@/pages/Payment/Success";
import Register from "@/pages/Reqister";
import Tours from "@/pages/Tour";
import TourDetails from "@/pages/TourDetails";
import Unauthorized from "@/pages/Unauthorized";
import Verify from "@/pages/Verify";
import type { TRole } from "@/types";
import generateRoutes from "@/utils/generateRoutes";
import { withAuth } from "@/utils/withAuth";
import { createBrowserRouter, Navigate } from "react-router";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";



export const router = createBrowserRouter([
    {
        Component: App,
        path: "/",
        children: [
            {
                Component: Homepage,
                index: true,
            },
            {
                Component: About,
                path: "about",
            },
            {
                Component: Tours,
                path: "tours",
            },
            {
                Component: TourDetails,
                path: "tours/:id",
            },
            {
                Component: withAuth(Booking),
                path: "booking/:id",
            },
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

])