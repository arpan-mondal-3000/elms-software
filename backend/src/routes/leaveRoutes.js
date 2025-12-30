import express from "express";
import { auth } from "../middlewares/auth.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
    getAllAdminLeaves,
    getAllEmployeeLeaves,
    createLeaveRequst,
    updateLeaveRequest,
    cancelLeaveRequest,
    setLeaveStatus
}
    from "../controllers/leaveController.js";

const leaveRouter = express.Router();

leaveRouter.get("/admin", auth, protectRoute(["admin"]), getAllAdminLeaves);
leaveRouter.get("/employee", auth, protectRoute(["employee"]), getAllEmployeeLeaves);

leaveRouter.post("/", auth, protectRoute(["employee"]), createLeaveRequst);
leaveRouter.put("/:leaveId", auth, protectRoute(["employee"]), updateLeaveRequest);
leaveRouter.post("/status/:leaveId", auth, protectRoute(["admin"]), setLeaveStatus);
leaveRouter.post("/cancel/:leaveId", auth, protectRoute(["employee"]), cancelLeaveRequest);

export default leaveRouter;