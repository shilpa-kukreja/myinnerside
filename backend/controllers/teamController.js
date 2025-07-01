import teamModel from "../models/teamModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const teamlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const team = await teamModel.findOne({ email: email });

    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: "Team not found" 
      });
    }

    // Check if team member is blocked (permission is false)
    if (team.permission === "false") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact admin."
      });
    }

    // Password comparison
    const isMatch = password === team.password; // Plain text comparison (not recommended for production)
    // For production, use: const isMatch = await bcrypt.compare(password, team.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // If everything is valid, generate token
    const token = jwt.sign({ id: team._id }, process.env.JWT_SECRET, {
      expiresIn: '1d' // Token expires in 1 day
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      team: {
        _id: team._id,
        name: team.name,
        email: team.email,
        image: team.image,
        permission: team.permission,
        userRole: team.userRole
      }
    });

  } catch (error) {
    console.error("Error in teamlogin:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
}



export const createTeam = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/team/${req.file.filename}` : "";
    const team = await teamModel.create({ ...req.body, image: imagePath });
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ Get All Team Members (Admin Only)
export const getAllTeams = async (req, res) => {
  try {
    const teams = await teamModel.find().select('-password'); // Don't send password
    res.status(200).json({ success: true, teams });
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// ✅ Delete a Team Member by ID (Admin Only)
export const deleteTeamMember = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await teamModel.findById(teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team member not found" });
    }

    await teamModel.findByIdAndDelete(teamId);
    res.status(200).json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updateTeam = async (req, res) => {
  try {
    const { 
      name, 
      aliasname, 
      email, 
      password, 
      number, 
      permission, 
      userRole, 
      dob, 
      gender 
    } = req.body;

    const updateData = { 
      name, 
      aliasname, 
      email, 
      password, 
      number, 
      permission, 
      userRole, 
      dob, 
      gender 
    };

    if (req.file) {
      updateData.image = `/uploads/team/${req.file.filename}`;
      // Optionally delete old image here if needed
    }

    const updated = await teamModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({ success: true, team: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



