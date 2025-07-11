import mongoose from 'mongoose';

const CouponClaimSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('CouponClaim', CouponClaimSchema);
