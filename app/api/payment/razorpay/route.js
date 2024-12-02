




// api/payment/razorpay.js
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount, currency = 'INR', receipt } = await req.json();

    const options = {
      amount: amount * 100, // amount in the smallest unit of currency
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
