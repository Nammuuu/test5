


// import { NextResponse } from "next/server";
// import connectToDatabase from "../../../../lib/mongodb";
// import Category from "../../../../models/Category";

// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Fetch all categories from the Category model
//     const categories = await Category.find({});

//     // Return the categories as a JSON response
//     return NextResponse.json(
//       { message: "Categories retrieved successfully", categories },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error retrieving categories:", error);
    
//     // Handle any errors with a 500 response
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get the category ID from the request query
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category");

    // If no category ID is provided, return a 400 error
    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    // Fetch products that match the given category
    const products = await Product.find({ category: categoryId });

    // Return the products as a JSON response
    return NextResponse.json(
      { message: "Products retrieved successfully", products },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving products:", error);

    // Handle any errors with a 500 response
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
