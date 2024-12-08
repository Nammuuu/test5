


import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Category from "../../../../../models/Category";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all categories from the Category model
    const categories = await Category.find({});

      // Set no-cache headers
      const headers = new Headers({
        'Cache-Control': 'public, max-age=0, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
      });

    // Return the categories as a JSON response
    return NextResponse.json(
      { message: "Categories retrieved successfully", categories },
      // { status: 200 }
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error retrieving categories:", error);
    
    // Handle any errors with a 500 response
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 