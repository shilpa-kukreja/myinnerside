import mongoose from 'mongoose';

const CouponClaimSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('CouponClaim', CouponClaimSchema);
