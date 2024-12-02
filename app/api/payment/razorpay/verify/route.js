


// api/payment/verify.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto.createHmac('sha256', secret)
                                      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
                                      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return NextResponse.json({ message: 'Payment verification successful' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





// import { NextResponse } from 'next/server';
// import crypto from 'crypto';
// import Order from '../../../../../models/Order';

// export async function POST(req) {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

//     // Fetch the order using the Razorpay order ID
//     const order = await Order.findOne({ razorpay_order_id });

//     if (!order) {
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 });
//     }

//     const secret = process.env.RAZORPAY_KEY_SECRET;
//     const generated_signature = crypto.createHmac('sha256', secret)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     if (generated_signature === razorpay_signature) {
//       // Update the order as paid
//       order.isPaid = true;
//       order.paidAt = new Date();
//       await order.save();

//       return NextResponse.json({
//         message: 'Payment verification successful',
//         orderId: order._id // Return the order ID
//       }, { status: 200 });
//     } else {
//       return NextResponse.json({
//         message: 'Payment verification failed',
//         orderId: razorpay_order_id
//       }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return NextResponse.json({
//       message: 'Internal server error',
//       error: error.message
//     }, { status: 500 });
//   }
// }


