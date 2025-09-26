import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { driverSidebarItems } from "@/routes/driverSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItems = (userRole: TRole) => {
    switch (userRole) {
        case role.super_admin:
            return [...adminSidebarItems];
        case role.admin: 
            return [...adminSidebarItems]
        case role.user: 
            return [...userSidebarItems]
        case role.driver:
            return [...driverSidebarItems]
        default:
            return []
    }
}