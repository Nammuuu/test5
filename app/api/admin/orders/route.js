

// import connectToDatabase from '../../../../lib/mongodb';
// import Order from '../../../../models/Order';
// import User from '../../../../models/User';

// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Get the authorization header
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
//     }

//     // Extract token from the header
//     const token = authHeader.split(' ')[1];
//     let decodedToken;

//     try {
//       // Verify the token
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }

//     // Fetch the user from the token
//     const user = await User.findById(decodedToken.userId);


//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
//     }

//     // Fetch all orders for the admin
//     const orders = await Order.find({})
//       .populate('user', 'name email') // Populate user data
//       .populate('orderItems.product', 'name price'); // Populate product data in order items

//     return NextResponse.json({ orders }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching orders:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


export const dynamic = 'force-dynamic';

import connectToDatabase from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import User from '../../../../models/User';

import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectToDatabase();

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      // Verify the token
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch the user from the token
    const user = await User.findById(decodedToken.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Fetch all orders for the admin
    const orders = await Order.find({})
      .populate('user', 'name email') // Populate user data
      .populate({
        path: 'orderItems.product',
        select: 'name price media', // Ensure to select the 'media' field
      });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
