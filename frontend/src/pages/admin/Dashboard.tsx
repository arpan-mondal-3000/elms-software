// Library import
import { Outlet } from "react-router"

// Components import
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AdminSidebar } from "../../components/AdminSidebar"

export default function AdminDashboard() {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full">
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}