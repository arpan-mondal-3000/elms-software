// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"

// Library
import { Routes, Route } from "react-router"

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
