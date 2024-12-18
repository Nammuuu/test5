


import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Category from "../../../../../models/Category";



// export async function GET() {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Fetch all categories from the database
//     const categories = await Category.find({});
//     // const categories = await Category.find();

//     // Return categories with no-cache headers
//     return NextResponse.json(
//       { message: "Categories retrieved successfully", categories },
//       {
//         status: 200,
//         headers: {
//           "Content-Type": "application/json",
//           "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
//           Pragma: "no-cache",
//           Expires: "0",
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Error retrieving categories:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all categories or return an empty array
    // const categories = await Category.find() || [];

    const categories = await Category.find({}).lean() || [];

    // Return categories with no-cache headers
    return NextResponse.json(
      { message: "Categories retrieved successfully", categories },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Fetch all categories from the Category model
//     const categories = await Category.find({});

//     // Disable caching by setting no-store headers
//     const headers = new Headers({
//       'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
//       Pragma: 'no-cache',
//       Expires: '0',
//       'Surrogate-Control': 'no-store',
//     });

//     // Return the categories as a JSON response
//     return NextResponse.json(
//       { message: "Categories retrieved successfully", categories },
//       { status: 200, headers }
//     );
//   } catch (error) {
//     console.error("Error retrieving categories:", error);

//     // Handle any errors with a 500 response
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Fetch all categories from the Category model
//     const categories = await Category.find({});

//       // Set no-cache headers
//       const headers = new Headers({
//         'Cache-Control': 'public, max-age=0, must-revalidate',
//         Pragma: 'no-cache',
//         Expires: '0',
//         'Surrogate-Control': 'no-store',
//       });

//     // Return the categories as a JSON response
//     return NextResponse.json(
//       { message: "Categories retrieved successfully", categories },
//       // { status: 200 }
//       { status: 200, headers }
//     );
//   } catch (error) {
//     console.error("Error retrieving categories:", error);
    
//     // Handle any errors with a 500 response
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }  