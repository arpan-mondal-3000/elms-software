import jwt from "jsonwebtoken";
import { db } from "../db/db.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";

export const auth = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ success: false, message: "No access token found!" });
        }
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const { id, email, role } = decoded;

        // Check if the user exists
        const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
        if (!user) {
            console.error(`User with id: ${id} not found!`);
            return res.status(401).json({ success: false, message: "User not found!" });
        }

        // attach user info with req
        req.user = { id, email, role };

        next();
    } catch (err) {
        console.error("Auth middleware error: ", err);
        res.status(401).json({ success: false, message: "You are unauthorized!" })
    }
}
