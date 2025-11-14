// Library import
import { Outlet } from "react-router"

// Components import
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { EmployeeSidebar } from "../../components/EmployeeSidebar"

export default function EmployeeDashboard() {

    return (
        <SidebarProvider>
<<<<<<< HEAD
            <EmployeeSidebar />
            <main>
=======
            <AdminSidebar />
            <main className="w-full">
                <div className="bg-gray-100">
>>>>>>> 3f6c48310952b4737fb7f257ed7e48e75774342e
                <SidebarTrigger />
                </div>
                <Outlet />
            </main>
        </SidebarProvider>
    )

}