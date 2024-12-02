
export const dynamic = 'force-dynamic';

import  connectToDatabase from '../../../../../lib/mongodb'; // Update the path as needed
import Order from '../../../../../models/Order'; // Import the Order model
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import Product from '../../../../../models/Product'; // Adjust the path as needed


const JWT_SECRET = process.env.JWT_SECRET; // Make sure to set your JWT_SECRET in .env file

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decodedToken.userId;
    const orders = await Order.find({ user: userId }).populate('orderItems.product');

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
