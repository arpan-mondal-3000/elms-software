import express from "express";
import { auth } from "../middlewares/auth.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getAllEmployees, approveEmployee, deleteEmployee, analyzeAbsentee } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/employees", auth, protectRoute(["admin"]), getAllEmployees);
adminRouter.post("/approve", auth, protectRoute(["admin"]), approveEmployee);
adminRouter.post("/reject", auth, protectRoute(["admin"]), deleteEmployee);
adminRouter.post("/analyze", auth, protectRoute(["admin"]), analyzeAbsentee);

export default adminRouter;
