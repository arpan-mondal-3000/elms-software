// Library import
import { Outlet } from "react-router"

// Components import
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AdminSidebar } from "../../components/EmployeeSidebar"

export default function EmployeeDashboard() {

         return (
        <SidebarProvider>
            <AdminSidebar />
            <main>
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
    
}