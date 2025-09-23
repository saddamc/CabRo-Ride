import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { cva } from "class-variance-authority";
import { Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Footer from "./common/Footer";
import Navbar from "./common/Navbar";

const dashboardVariants = cva(
    "transition-all duration-300 ease-in-out",
    {
        variants: {
            layout: {
                default: "bg-white dark:bg-gray-950",
                gradient: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900",
            },
        },
        defaultVariants: {
            layout: "default",
        },
    }
);

export default function DashboardLayout() {
    const { data: userInfo, isLoading } = useUserInfoQuery(undefined);
    
    return (
        <div className="flex flex-col min-h-screen">
            {/* Top Navbar */}
            <Navbar />
            
            <div className="flex-1 flex">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className={dashboardVariants()}>
                        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white dark:bg-gray-900">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <div className="flex items-center justify-between w-full">
                                <div className="ml-2">
                                    <h1 className="text-xl font-semibold">Dashboard</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {userInfo?.data?.role === 'admin' ? 'Admin Panel' : 'User Dashboard'}
                                    </p>
                                </div>
                                
                                {!isLoading && userInfo?.data && (
                                    <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium">{userInfo.data.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userInfo.data.role}</p>
                                        </div>
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage 
                                                src={userInfo.data.profilePicture || ''} 
                                                alt={userInfo.data.name || 'User'} 
                                            />
                                            <AvatarFallback className="bg-primary text-white">
                                                {userInfo.data.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </div>
                        </header>
                        <div className="flex-1 p-0 md:p-6">
                            <Outlet />
                        </div>
                    </SidebarInset>
                </SidebarProvider>
            </div>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}
