


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb'; 
import Banner from '../../../../../models/Banner';
import { cloudinaryUploadcategory } from '../../../../../lib/cloudinary'; 
import jwt from 'jsonwebtoken'; 
import User from '../../../../../models/User'; 

 
export async function GET(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Fetch all banners
    const banners = await Banner.find();

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


const JWT_SECRET = process.env.JWT_SECRET; 
export async function POST(req) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Check if authorization header is present
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if the user is an admin
    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Only admins can create banners" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const heading = formData.get('heading');
    const description = formData.get('description');
    const productUrl = formData.get('productUrl');
    const bannerImage = formData.get('image'); // Single image

    console.log("formData", formData)
    console.log("title", title)
    console.log("heading", heading)
    console.log("description", description)
    console.log("productUrl", productUrl)
    console.log("bannerImage", bannerImage)
    
    // Validate required fields
    if (!title || !heading || !description || !productUrl || !bannerImage) {
      return NextResponse.json({
        message: 'Missing required fields',
      }, { status: 400 });
    }

    // Convert image file to base64
    const imageBuffer = Buffer.from(await bannerImage.arrayBuffer());
    const cloudinaryRes = await cloudinaryUploadcategory(imageBuffer.toString('base64'), 'banner_images');

    // Create a new banner
    const newBanner = new Banner({
      images: cloudinaryRes.secure_url, // Store the image URL
      title,
      heading,
      description,
      productUrl,
      createdAt: new Date(),
    });

    await newBanner.save(); // Save the banner to MongoDB

    return NextResponse.json({
      message: 'Banner created successfully',
      banner: newBanner,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({
      message: 'Internal server error',
    }, { status: 500 });
  }
}




export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    // Check if authorization header is present
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Extract and verify the token
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if the user is an admin
    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bannerId = params.id;
    const deletedBanner = await Banner.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      return NextResponse.json({ message: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
