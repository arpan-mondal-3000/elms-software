// Library import
import { Outlet } from "react-router"

// Components import
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { EmployeeSidebar } from "../../components/EmployeeSidebar"

export default function EmployeeDashboard() {

    return (
        <SidebarProvider>
            <EmployeeSidebar />
            <main>
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )

}