
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);


export async function POST(req) {
  try {
    const { orderId } = await req.json();

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);

    if (capture.result.status === 'COMPLETED') {
      return NextResponse.json({ message: 'Payment successful', orderId: 'order_id_here' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Payment failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
