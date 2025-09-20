import type { ISidebarItem } from "@/types";

const generateRoutes = (sidebarItems : ISidebarItem[]) => {
    return sidebarItems.flatMap((section) => 
        section.items.map((route) => ({
            path: route.url,
            Component: route.component,
        }))
    );
};

export default generateRoutes;