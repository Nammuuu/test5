


import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },  // Coupon code
  discount: { type: Number, default: 0 },  // Discount percentage
  validUntil: { type: Date, required: true }  // Expiry date
});

// Export the model
export default mongoose.models.Coupons || mongoose.model('Coupons', CouponSchema);
