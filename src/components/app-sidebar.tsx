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
    return location.pathname === url
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
                     <SidebarMenuButton asChild isActive={isActive(item.url)}>
                       <Link
                         to={item.url}
                         className={cn(
                           "transition-colors",
                           isActive(item.url) && userRole === 'rider' && "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
                           isActive(item.url) && userRole === 'driver' && "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
                           isActive(item.url) && (userRole === 'admin' || userRole === 'super_admin') && "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
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
