
import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const RiderProfile = lazy(() => import("@/pages/Rider/Profile"));
const UserWallet = lazy(() => import("@/pages/User/Wallet"));
const RiderRideHistory = lazy(() => import("@/pages/Rider/RideHistory"));

export const userSidebarItems : ISidebarItem[] = [
    {
        title: "User",
        items: [
            {
                title: "Profile",
                url: "/user/profile",
                component: RiderProfile,
            },
            {
                title: "Wallet",
                url: "/user/wallet",
                component: UserWallet,
            },
        ],
    },
    {
        title: "History",
        items: [
            {
                title: "Ride History",
                url: "/user/history",
                component: RiderRideHistory,
            },
        ],
    },
]