import express from 'express';

import authUser from '../middleware/auth.js';
import { assignTeamMember, bookAppointment, cancelAppointment, getAllapppointments, getBookedSlots, getMyAssignedAppointments, removeappointment, resduleAppointment } from '../controllers/appointmentController.js';
import authAdmin from '../middleware/authAdmin.js';
import { isTeamMember } from '../middleware/isTeamMember.js';
import authTeam from '../middleware/authTeam.js';

const router = express.Router();

router.post('/book',authUser, bookAppointment);
router.post('/booked-slots',authUser, getBookedSlots);
router.post('/reschedule', resduleAppointment);
router.post('/cancel', cancelAppointment); // Assuming cancel is similar to reschedule
router.delete('/:id', removeappointment); 
router.get('/all',  getAllapppointments); 
router.put('/:id/assign',assignTeamMember);
router.get('/my-assigned',authTeam, isTeamMember, getMyAssignedAppointments);

export default router;

