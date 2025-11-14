import express from "express";
import { auth } from "../middlewares/auth.js";
import { getProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/profile", auth, getProfile);

export default userRouter;