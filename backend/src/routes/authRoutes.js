import express from "express";
import { register, login, refreshAccessToken, logout } from "../controllers/authControllers.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh", refreshAccessToken);
authRouter.get("/logout", auth, logout);

export default authRouter;