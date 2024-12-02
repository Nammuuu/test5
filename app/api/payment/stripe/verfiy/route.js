





// /pages/api/payment/stripe/verify.js
// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     const { paymentIntentId, orderId } = await req.json();

//     // Retrieve the payment intent from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === 'succeeded') {
//       // Payment was successful, you can add your order confirmation logic here
//       return NextResponse.json({ success: true, orderId });
//     } else {
//       // Payment verification failed
//       return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { paymentIntentId, orderId } = await req.json();

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful, you can add your order confirmation logic here
      return NextResponse.json({ success: true, orderId });
    } else {
      // Payment verification failed
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
