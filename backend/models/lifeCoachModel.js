import mongoose from "mongoose";

const lifeCoshSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    number: {
    type: String,
    required: true,
    match: /^\d{10}$/,
  },
  language: {
    type: String,
    required: true,
  },
  bookingReason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const lifeCoshModel = mongoose.models.lifeCosh || mongoose.model('lifeCosh', lifeCoshSchema);
export default lifeCoshModel;
