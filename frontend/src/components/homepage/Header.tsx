import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

import { useNavigate } from "react-router"
import { useAuthStore } from "../../store/authStore";
import { UserRound } from 'lucide-react';


export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold">
            PL
          </div>
          <span className="font-semibold text-lg">ProLeave</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
            Benefits
          </a>
          <a href="#join" className="text-sm font-medium hover:text-primary transition-colors">
            Join
          </a>
        </nav>
        {user &&
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-10 h-10 rounded-full">
                  <UserRound />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Hello {user.firstName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user.role === "employee" ? "/employee" : "/admin")}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        {!user &&
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate("/register")}>Register</Button>
          </div>
        }
      </div>
    </header >
  )
}
