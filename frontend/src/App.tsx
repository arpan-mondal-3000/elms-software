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

// Library
import { Routes, Route } from "react-router"

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin" element={<AdminDashboard />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="view-registrations" element={<ViewRegistrations />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        <Route path="employee" element={<EmployeeDashboard />} />
      </Routes>
    </>
  )
}

export default App
