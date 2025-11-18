// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

import AdminDashboard from "./pages/admin/Dashboard"
import AdminDashboardHome from "./pages/admin/AdminDashboardHome"
import ViewRegistrations from "./pages/admin/ViewRegistrations"
import LeaveRequests from "./pages/admin/LeaveRequests"
import Analytics from "./pages/admin/Analytics"

import EmployeeDashboard from "./pages/employee/Dashboard"
import Status from "./pages/employee/Status"
import ApplyForLeave from "./pages/employee/ApplyForLeave"
import ViewRemainingLeave from "./pages/employee/ViewRemainingLeave"

import ProtectRoute from "./components/ProtectRoute"

// Library
import { Routes, Route } from "react-router"
import EmployeeDashboardHome from "./pages/employee/EmployeeDashboardHome"
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<ProtectRoute allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="view-registrations" element={<ViewRegistrations />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>
        <Route element={<ProtectRoute allowedRoles={["employee"]} />}>
          <Route path="employee" element={<EmployeeDashboard />} >
            <Route index element={<EmployeeDashboardHome />} />
            <Route path="apply-for-leave" element={<ApplyForLeave />} />
            <Route path="status" element={<Status />} />
            <Route path="remaining-leave" element={< ViewRemainingLeave />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
