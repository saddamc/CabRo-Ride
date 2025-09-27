import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
const RideHistory = lazy(() => import("@/pages/Admin/RideHistory"));
const Wallet = lazy(() => import("@/pages/Admin/Wallet"));
const Profile = lazy(() => import("@/pages/Admin/Profile"));
const DriverManagement = lazy(() => import("@/pages/Admin/DriverManagement"));
const RiderManagement = lazy(() => import("@/pages/Admin/RiderManagement"));

export const adminSidebarItems : ISidebarItem[] = [
    {
        title: "Overview",
        items: [
            {
                title: "Dashboard",
                url: "/admin/dashboard",
                component: Dashboard,
            },
        ],
    },
    {
        title: "Management",
        items: [
            {
                title: "Ride History",
                url: "/admin/rides",
                component: RideHistory,
            },
            {
                title: "Wallet",
                url: "/admin/wallet",
                component: Wallet,
            },
        ],
    },
    {
        title: "User Management",
        items: [
            {
                title: "Drivers",
                url: "/admin/drivers",
                component: DriverManagement,
            },
            {
                title: "Riders",
                url: "/admin/riders",
                component: RiderManagement,
            },
        ],
    },
    {
        title: "Account",
        items: [
            {
                title: "Account Settings",
                url: "/admin/profile",
                component: Profile,
            },
        ],
    },
]