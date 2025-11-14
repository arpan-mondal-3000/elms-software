import express from "express";
import { auth } from "../middlewares/auth.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { getProfile, approveEmployee } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/profile", auth, getProfile);
userRouter.put("/approve", auth, protectRoute(["admin"]), approveEmployee);

export default userRouter;