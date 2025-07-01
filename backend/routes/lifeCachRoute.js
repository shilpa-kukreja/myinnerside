import express from 'express';
import { addBooking, cancelBooking, getBookedlifeSlots, getBookedSlots, lifeCoachappointmentlist, removeliofecoach } from '../controllers/lifeCoachController.js';
import authUser from '../middleware/auth.js';



const lifecachrouter = express.Router();

lifecachrouter.post('/book',authUser, addBooking);
lifecachrouter.post('/slots',authUser, getBookedSlots);
lifecachrouter.get('/lifecoachslot/bookedcoach-slots', getBookedlifeSlots);
lifecachrouter.post('/cancel', cancelBooking)
lifecachrouter.delete('/:id', removeliofecoach); 
lifecachrouter.get('/all',  lifeCoachappointmentlist); 

export default lifecachrouter;



