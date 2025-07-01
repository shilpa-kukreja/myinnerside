import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true }, 
  slot: { type: String, required: true }, 
  status: { type: String, enum: ['available', 'booked', 'disabled'], default: 'available' }
}, { timestamps: true });

const AdminslotModel = mongoose.models.Adminslot || mongoose.model('Adminslot', slotSchema);
export default AdminslotModel;
