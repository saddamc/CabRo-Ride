import type { ISidebarItem } from "@/types";
import { lazy } from "react";

const DriverDashboard = lazy(() => import("@/pages/Driver/Dashboard"));
const DriverEarnings = lazy(() => import("@/pages/Driver/Earnings"));
const DriverWallet = lazy(() => import("@/pages/Driver/Wallet"));
const DriverRideHistory = lazy(() => import("@/pages/Driver/RideHistory"));

export const driverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/driver/dashboard",
        component: DriverDashboard,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Earnings",
        url: "/driver/earnings",
        component: DriverEarnings,
      },
      {
        title: "Wallet",
        url: "/driver/wallet",
        component: DriverWallet,
      },
    ],
  },
  {
    title: "History",
    items: [
      {
        title: "Ride History",
        url: "/driver/history",
        component: DriverRideHistory,
      },
    ],
  },
];