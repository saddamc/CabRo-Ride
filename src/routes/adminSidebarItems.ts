import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const Dashboard = lazy(() => import("@/pages/Admin/Dashboard"));
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
]