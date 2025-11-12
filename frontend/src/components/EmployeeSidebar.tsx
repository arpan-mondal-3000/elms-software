import { Calendar, Home, Inbox, ChevronUp, User2 } from "lucide-react"
import { Link } from "react-router"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter
} from "./ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

// Menu items
const items = [
    {
        title: "Home",
        url: "/employee",
        icon: Home,
    },
    {
        title: "Apply for Leave",
        url: "/employee/apply-for-leave",
        icon: Inbox,
    },
    {
        title: "View Status",
        url: "/employee/status",
        icon: Calendar,
    },
    {
        title:"View Remaining Leaves",
        url:"/employee/remaining-leave",
        icon: Calendar
    }
   
]

export function AdminSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-end gap-2 my-4">
                    <Link to="/">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold">
                            PL
                        </div>
                    </Link>
                    <p className="font-bold">Employee Dashboard</p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="text-[16px]">
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu >
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Hello Admin
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>My Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span className="text-red-400">Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}