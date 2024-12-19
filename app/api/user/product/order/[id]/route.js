// File: /pages/api/user/get.js
export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../../../lib/mongodb';

import User from '../../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Populate product details including the image in the GET request
const order = await Order.findById(orderId)
.populate({
  path: 'orderItems.product',
  select: 'name image price size color', // Include image
})
.populate('user');



    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
