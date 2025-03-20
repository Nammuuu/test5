
import mongoose from 'mongoose';
import Product from './Product'; 

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [

      
      {
        quantity: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        size: { type: String },
        color: { type: String },
        selectedAttributes: {
          type: Map,
          of: String, // ✅ Dynamic key-value pair for attributes
          default: {},
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      address2: { type: String },
      phoneNo: { type: Number, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      landmark: { type: String, required: true },
      country: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: "cashOnDelivery" },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true },
    paidAt: { type: Date, required: true },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    userChannelOrder: {
      type: Boolean,
      default: false,
    },
    reportMessages: [
      {
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    coupon: {
      code: { type: String },
      discount: { type: Number },
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
