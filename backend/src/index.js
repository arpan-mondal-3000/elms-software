import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

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

// Listen for incoming connections
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})