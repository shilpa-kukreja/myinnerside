import mongoose from "mongoose";

const appointmentSchema=new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
 name:{ type: String, required: true },
  email: { type: String, required: true }, 
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  language: { type: String, required: true },
  bookingReason: { type: String, required: true },
  assignedTeamMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  hideIdentity: { type: Boolean, default: false },
  usePreviousDetails: { type: Boolean, default: false },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  couponCode: { type: String, default: null },
  discount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  isrescheduled: { type: Boolean, default: false },
  rescheduledDate: { type: String, default: null },
  rescheduledTimeSlot: { type: String, default: null },

}, { timestamps: true });   
const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);
export default appointmentModel;
 