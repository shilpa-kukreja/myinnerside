import jwt from 'jsonwebtoken';




const authAdmin = (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if (!atoken) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const token_decoded = jwt.verify(atoken, process.env.JWT_SECRET);
        if (token_decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ message: "Not Authorized login again" });
        }
        next();
        
    } catch (error) {
        console.error("❌ Authentication Error:", error.message);
        return res.status(500).json({ message: "Server error during authentication", error: error.message });
    }
}
export default authAdmin;