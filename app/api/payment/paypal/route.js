


// /api/payment/paypal.js

import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);



export async function POST(req) {
  try {
    const { amount } = await req.json();

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    });

    const order = await client.execute(request);

    return NextResponse.json({ approvalUrl: order.result.links.find(link => link.rel === 'approve').href });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

