import jwt from 'jsonwebtoken';
import teamModel from '../models/teamModel.js';

const authTeam = async (req, res, next) => {
  try {
    const { ttoken } = req.headers;

    if (!ttoken) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const token_decoded = jwt.verify(ttoken, process.env.JWT_SECRET);
    if (!token_decoded || !token_decoded.id) {
      return res.status(403).json({ message: "Not Authorized login again" });
    }

    const teamUser = await teamModel.findById(token_decoded.id);

    if (!teamUser) {
      return res.status(403).json({ message: "Team member not found" });
    }

    req.user = teamUser; // ✅ Needed for isTeamMember middleware
    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    return res.status(500).json({ message: "Server error during authentication", error: error.message });
  }
};

export default authTeam;
