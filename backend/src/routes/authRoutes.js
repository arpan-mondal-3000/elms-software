import express from "express";
import { register, login, refreshAccessToken } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refreshAccessToken);

export default authRouter;