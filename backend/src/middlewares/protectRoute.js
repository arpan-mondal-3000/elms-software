export const protectRoute = (allowedUsers = []) => {
    return (req, res, next) => {
        try {
            const role = req.user.role;

            if (!allowedUsers.includes(role)) {
                return res
                    .status(401)
                    .json({ success: false, message: "You are not authorized!" });
            }

            next();
        } catch (err) {
            console.error("Cannot access this route.");
            return res
                .status(401)
                .json({ success: false, message: "You are not authorized!" });
        }
    };
};