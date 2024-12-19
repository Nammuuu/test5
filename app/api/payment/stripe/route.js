


// /api/payment/stripe.js




// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     const { amount, description, customer } = await req.json();

//     // Ensure full customer details are provided
//     if (!customer || !customer.name || !customer.address) {
//       return NextResponse.json({ message: 'Customer details are required for payment' }, { status: 400 });
//     }

//     // Create the payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Convert to cents
//       currency: 'usd',
//       description,  // Include the order description
//       shipping: {
//         name: customer.name,
//         address: {
//           line1: customer.address.line1,
//           city: customer.address.city,
//           state: customer.address.state,
//           postal_code: customer.address.postal_code,
//           country: customer.address.country || 'IN',  // Ensure country is provided
//         },
//       },
//       receipt_email: customer.email,
//     });

//     return NextResponse.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     console.error('Error creating Stripe payment intent:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, description, customer } = await req.json();

    // Ensure full customer details are provided
    if (!customer || !customer.name || !customer.address) {
      return NextResponse.json({ message: 'Customer details are required for payment' }, { status: 400 });
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      description,  // Include the order description
      shipping: {
        name: customer.name,
        address: {
          line1: customer.address.line1,
          city: customer.address.city,
          state: customer.address.state,
          postal_code: customer.address.postal_code,
          country: customer.address.country || 'IN',  // Ensure country is provided
        },
      },
      receipt_email: customer.email,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
