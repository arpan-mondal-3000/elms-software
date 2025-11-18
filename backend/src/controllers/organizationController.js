import { db } from "../db/db.js";

export const getOrganizationData = async (req, res) => {
    try {
        const data = await db.query.organizations.findMany({
            with: {
                departments: true,
            }
        })
        if (!data) {
            throw new Error("Failed to fetch organizations and departments!");
        }
        return res.status(200).json({ success: true, message: "Origanization and departments fetched successfully.", data })
    } catch (err) {
        console.error("Error getting organization data: ", err);
        res.status(500).json({ success: false, message: "Error getting organization data!" })
    }
}