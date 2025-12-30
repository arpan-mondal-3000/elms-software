import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routers
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import orgRouter from "./routes/orgRoutes.js";
import leaveRouter from "./routes/leaveRoutes.js";

const app = express();

// middlewares setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error("Blocked by CORS: ", origin);
            callback(new Error("Blocked by CORS"));
        }
    },
    credentials: true
}));

// Routes setup
app.get("/api", (req, res) => {
    res.json({ message: "Hello from employee leave management system." });
})

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/org", orgRouter);
app.use("/api/leave", leaveRouter);

// Listen for incoming connections
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})