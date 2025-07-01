
import express from 'express';
import { getBookedAdminSlots, getBookedSlots, toggleSlotAvailability } from '../controllers/adminslotController.js';


const Adminslotrouter = express.Router();

Adminslotrouter.get('/slots', getBookedSlots);
Adminslotrouter.post('/slots/toggle', toggleSlotAvailability);
Adminslotrouter.get('/booked-slots', getBookedAdminSlots);

export default Adminslotrouter;
