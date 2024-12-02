


import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import Product from '../../../../../models/Product';
const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req, { params }) {
  const { id } = params;
  
  try {
      // Connect to the database
      await connectToDatabase();
      
      // Fetch the product by ID from the database
      const product = await Product.findById(id);
      
      if (!product) {
          return NextResponse.json({ message: 'Product not found' }, { status: 404 });
      }
      
      // Return the product as a response
      return NextResponse.json({ message: 'Product retrieved successfully', product }, { status: 200 });
  } catch (error) {
      console.error('Error retrieving product:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Check for authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Find the user by ID
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse the request body
    const { productId, rating, comment, profilePictureImagePreview } = await req.json();

    if (!productId || !rating || !comment) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Create a new review object
    const newReview = {
      user: user._id,
      rating: Number(rating),
      comment,
      profilePictureImagePreview, // Ensure this field is included
      createdAt: new Date(),
    };

    console.log("New review before adding to product:", newReview);

    // Manually check the product and save
    console.log("Product before manually adding review:", product);
    product.reviews.push(newReview);

    // Add manual save check
    await product.save();
    console.log("Product after manual save:", product);

    return NextResponse.json({ message: "Review added successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
