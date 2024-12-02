

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import jwt from 'jsonwebtoken';

import User from '../../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

// Get Product and its Reviews
 
export async function GET(req) {
  try {
    // Connect to the database
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


    // Fetch all products and populate only the reviews and user details in reviews
    const products = await Product.find({}).populate({
      path: 'reviews.user', // Populate the user in reviews
      select: 'username  name profilePictureImagePreview',
     
    });

    // If no products are found
    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    // Return the list of products with populated reviews
    return NextResponse.json({ message: 'Products and reviews retrieved successfully', products }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving products and reviews:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

