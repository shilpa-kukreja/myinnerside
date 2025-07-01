import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import lifeCoshModel from '../models/lifeCoachModel.js'
import userModel from '../models/userModel.js'
import teamModel from '../models/teamModel.js'

//api for the admin login

export const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: 'Invalid Credentials' })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


export const adminDashboard = async (req, res) => {
    try {
        // Start all data fetching in parallel
        const [
            teams,
            users,
            appointments,
            slots,
            lifeCoachAppointments
        ] = await Promise.all([
            teamModel.find({})
                .select('name aliasname email number image gender dob userRole permission createdAt')
                .lean(),

            // Get all users with basic info
            userModel.find({})
                .select('name aliasName email role createdAt lastLogin')
                .sort({ createdAt: -1 })
                .limit(100)
                .lean(),

            // Get all appointments with user and team info
            appointmentModel.find({})
                .populate('userId', 'name email') // ✅ match your schema
                .populate('assignedTeamMember', 'name') // ✅ match your schema
                .sort({ date: -1 })
                .lean(),

            // Get slots data for calendar/availability
            appointmentModel.find({})
                .select('date slot status')
                .sort({ date: 1 })
                .lean(),

            // Get life coach appointments
            lifeCoshModel.find({})
                .populate('userId', 'name email')  // ✅ correct field name
                .sort({ createdAt: -1 })
                .lean()
        ]);

        // Process data for dashboard metrics
        const metrics = {
            totalUsers: users.length,
            totalTeams: teams.length,
            activeAppointments: appointments.length,         // assume all confirmed
            pendingAppointments: lifeCoachAppointments.length,
            upcomingSessions: lifeCoachAppointments.filter(a =>
                new Date(a.date) > new Date()
            ).length
        };

        // Prepare dashboard response
        const dashboardData = {
            metrics,
            recentUsers: users.slice(0, 5),
            recentAppointments: appointments.slice(0, 5),
            upcomingSlots: slots.filter(slot =>
                new Date(slot.date) > new Date()
            ).slice(0, 10),
            teams,
            appointments,
            lifeCoachAppointments
        };

        console.log('Admin dashboard data fetched successfully');
        res.status(200).json({
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: dashboardData
        });

    } catch (error) {
        console.error('Admin Dashboard Error:', error.message, {
            stack: error.stack,
            userId: req.user?._id
        });

        res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};