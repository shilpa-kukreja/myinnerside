// routes/paymentRoutes.js
import express from 'express';
import { createPaymentOrder } from '../controllers/paymentController.js';
import { verifyPaymentAndBook } from '../controllers/appointmentController.js';
import authUser from '../middleware/auth.js';

const Paymentrouter = express.Router();

Paymentrouter.post('/create-order', createPaymentOrder);
Paymentrouter.post('/verify-payment',authUser,verifyPaymentAndBook);

export default Paymentrouter;
