import express from 'express';
import {adminDashboard, loginAdmin,} from '../controllers/adminController.js';
import { createTeam, deleteTeamMember, getAllTeams, updateTeam } from '../controllers/teamController.js';
import uploads from '../middleware/multers.js';
import authAdmin from '../middleware/authAdmin.js';

const adminRouter = express.Router();
adminRouter.post('/login',loginAdmin)
adminRouter.post('/add',authAdmin,uploads.single('image'),createTeam)
adminRouter.get('/teams', getAllTeams); // GET all team members
adminRouter.delete('/team/:id', deleteTeamMember); 
adminRouter.put('/team/:id', authAdmin, uploads.single('image'), updateTeam); // Update team member by ID
adminRouter.get('/dashboard', authAdmin, adminDashboard); // Get all teams


export default adminRouter;