
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';


// export async function GET(req) {
//     try {
//       // Connect to the database
//       await connectToDatabase();
//       // Fetch all products from the database
//       const products = await Product.find({});
//       // Return the products as a response
//       return NextResponse.json({ message: 'Products retrieved successfully', products }, { status: 200 });
//     } catch (error) {
//       console.error('Error retrieving products:', error);
//       return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
//   }



export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all products from the products model
    const products = await Product.find({});

    // Disable caching by setting no-store headers
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });

    // Return the categories as a JSON response
    
    return NextResponse.json(
      { message: 'Products retrieved successfully', products },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    // Handle any errors with a 500 response
  }
}

// export async function GET(req) {
//   try {
//     await connectToDatabase();
//     const products = await Product.find({});

//     return NextResponse.json(
//       { message: 'Products retrieved successfully', products },
//       {
//         status: 200,
//         headers: {
//           'Cache-Control': 'no-store', // Prevent caching
//         },
//       }
//     );
//   } catch (error) {
//     console.error('Error retrieving products:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
