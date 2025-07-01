import express from 'express';
import { getAppointmentDateTime, getBookedSlots } from '../controllers/bookingController.js';




const bookingRouter = express.Router();


bookingRouter.get('/appointments/datetime', getAppointmentDateTime);
bookingRouter.get('/appointments/booked-slots', getBookedSlots);

export default bookingRouter;


