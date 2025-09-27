import * as React from "react"
import { useLocation } from "react-router-dom"

import Logo from "@/assets/icons/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { getSidebarItems } from "@/utils/getSidebarItems"
import { Link } from "react-router-dom"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: userData } = useUserInfoQuery(undefined)
  const location = useLocation()
  const userRole = userData?.data?.role || 'rider'

  const data = {
    navMain: getSidebarItems(userData?.data?.role)
  }

  // Function to check if a menu item is active
  const isActive = (url: string) => {
    if (url === '/' && location.pathname === '/') return true;
    if (url !== '/' && location.pathname.startsWith(url)) return true;
    return false;
  }

  
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" ><Logo /></Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                 {item.items.map((item) => (
                   <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton asChild>
                       <Link
                         to={item.url}
                         className={cn(
                           "transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                           isActive(item.url) && userRole === 'rider' && "bg-green-600 text-white dark:bg-green-700 dark:text-white",
                           isActive(item.url) && userRole === 'driver' && "bg-blue-600 text-white dark:bg-blue-700 dark:text-white",
                           isActive(item.url) && (userRole === 'admin' || userRole === 'super_admin') && "bg-purple-600 text-white dark:bg-purple-700 dark:text-white"
                         )}
                       >
                         {item.title}
                       </Link>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                 ))}
               </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
