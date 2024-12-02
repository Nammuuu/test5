

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb'; 
import Banner from '../../../../../../models/Banner';
import { cloudinaryUploadcategory } from '../../../../../../lib/cloudinary'; 
import jwt from 'jsonwebtoken'; 
import User from '../../../../../../models/User'; 


const JWT_SECRET = process.env.JWT_SECRET; 
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