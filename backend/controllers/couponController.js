import CouponClaim from "../models/CouponClaim.js";
import Coupon from "../models/couponModel.js";




export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, totalAmount } = req.body;

    console.log("Received coupon code:", couponCode);
    console.log("Received totalAmount:", totalAmount);

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount received",
      });
    }

    // Find the coupon
    const coupon = await Coupon.findOne({ couponCode, isActive: true });

    if (!coupon) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid coupon code" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    if (totalAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount is ₹${coupon.minPurchaseAmount}`,
      });
    }

    let discount = coupon.discount; // Fixed amount discount
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    // Calculate new total after discount
    const newTotalAmount = Math.max(totalAmount - discount, 0);

    console.log("Calculated discount:", discount);
    console.log("New total amount:", newTotalAmount);

   return res.status(200).json({
  success: true,
  discount: discount,
  newTotalAmount,
  discounttype: coupon.discounttype,
  coupon, 
});

  } catch (error) {
    console.error("Error in applyCoupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const addCoupan = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing." });
    }

    const {
      couponCode,
      discount,
      expiryDate,
      minPurchaseAmount,
      maxDiscountAmount,
      isActive,
      discounttype,
    } = req.body;

    const existing = await Coupon.findOne({ couponCode });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      couponCode,
      discount,
      expiryDate,
      minPurchaseAmount,
      maxDiscountAmount,
      isActive,
      discounttype,
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ coupons });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





export const getActiveCoupon = async (req, res) => {
  try {
    const today = new Date();
    const coupon = await Coupon.findOne({
      isActive: true,
      expiryDate: { $gte: today }
    }).sort({ createdAt: -1 });

    if (!coupon) {
      return res.status(404).json({ message: 'No active coupon found' });
    }

    res.status(200).json({ coupon });
  } catch (err) {
    console.error('Error fetching active coupon:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const claimCoupon = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const claim = new CouponClaim({ phone });
    await claim.save();

    res.status(201).json({ message: 'Phone saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const removeCoupons=async(req,res)=>{
  try {
     await Coupon.findByIdAndDelete(req.body.id);
     res.json({ success: true, message: 'Coupon removed successfully' });
   } catch (error) {
     console.error(error);
     res.json({ success: false, message: 'Error deleting Coupon' });
   }
}


export const updateCoupons = async (req, res) => {
  try {
    const { couponCode, discount, expiryDate, minPurchaseAmount, maxDiscountAmount, isActive, discounttype } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      {
        couponCode,
        discount,
        expiryDate,
        minPurchaseAmount,
        maxDiscountAmount,
        isActive,
        discounttype,
      },
      { new: true }
    );

    if (!updatedCoupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    res.json({ success: true, message: 'Coupon updated successfully', coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating Coupon' });
  }
};

// Toggle coupon status
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`, coupon });
  } catch (err) {
    console.error('Error toggling status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
