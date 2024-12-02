import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Category from "../../../../../models/Category";
import jwt from "jsonwebtoken";
import User from "../../../../../models/User";
// import cloudinary from "../../../../../lib/cloudinary";
import { cloudinaryUploadcategory } from '../../../../../lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectToDatabase();
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

    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Only admins can retrieve categories" }, { status: 401 });
    }

    const categories = await Category.find({});
    return NextResponse.json({ message: "Categories retrieved successfully", categories }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}




// export async function POST(req) {
//   try {
//     await connectToDatabase();
    
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ message: "Unauthorized: Only admins can create categories" }, { status: 401 });
//     }

//     const form = new URLSearchParams(await req.text());
//     const name = form.get("name");
//     const base64Image = form.get("categoryImage");

//     if (!name || !base64Image) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // Upload the image to Cloudinary
//     const imageUpload = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`);

//     // Create a new category
//     const newCategory = new Category({
//       name,
//       categoryImage: imageUpload.secure_url, // Ensure the image URL is saved correctly
//     });

//     await newCategory.save();

//     return NextResponse.json({ message: "Category created successfully", category: newCategory }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating category:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

export async function POST(req) {
  try {
    await connectToDatabase();
    
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

    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Only admins can create categories" }, { status: 401 });
    }

    const form = new URLSearchParams(await req.text());
    const name = form.get("name");
    const base64Image = form.get("categoryImage");

    if (!name || !base64Image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Upload the image to Cloudinary
    const imageUpload = await cloudinaryUploadcategory(base64Image, 'category_images');

    // Create a new category
    const newCategory = new Category({
      name,
      categoryImage: imageUpload.secure_url,
    });

    await newCategory.save();

    return NextResponse.json({ message: "Category created successfully", category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



