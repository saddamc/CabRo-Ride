
import type { ISidebarItem } from "@/types";

export const userSidebarItems : ISidebarItem[] = [
    {
        title: "User",
        items: [
            {
                title: "Profile",
                url: "/user/profile",
                icon: "user",
            },
            {
                title: "Wallet",
                url: "/user/wallet",
                icon: "wallet",
            },
        ],
    },
    {
        title: "History",
        items: [
            {
                title: "Ride History",
                url: "/user/history",
                icon: "history",
            },
        ],
    },
]