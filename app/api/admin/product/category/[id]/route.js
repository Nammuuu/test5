// File: /app/api/category/[id]/route.js


// import { NextResponse } from "next/server";
// import connectToDatabase from "../../../../../../lib/mongodb";
// import Category from "../../../../../../models/Category";


// export async function DELETE(req, { params }) {
//   try {
//     await connectToDatabase();
    
//     const { id } = params;

//     // Find the category by ID and delete it
//     const category = await Category.findByIdAndDelete(id);

//     if (!category) {
//       return NextResponse.json({ message: 'Category not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import connectToDatabase from "../../../../../../lib/mongodb";
import Category from "../../../../../../models/Category";
import User from "../../../../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function DELETE(req, { params }) {
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
      return NextResponse.json({ message: "Unauthorized: Only admins can delete categories" }, { status: 401 });
    }

    const { id } = params;

    // Find the category by ID and delete it
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
