import express from 'express'
import authUser from '../middleware/auth.js';
import { addCoupan, applyCoupon, getAllCoupons, removeCoupons, toggleCouponStatus, updateCoupons } from '../controllers/couponController.js';



const couponRouter=express.Router();


couponRouter.post('/apply',applyCoupon)
couponRouter.post('/add',addCoupan);
couponRouter.get("/get", getAllCoupons); 
couponRouter.put("/:id/toggle", toggleCouponStatus);
couponRouter.post('/remove', removeCoupons);
couponRouter.put('/:id', updateCoupons);


export default couponRouter