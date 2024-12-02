

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import mongoose from 'mongoose';



// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('query') || '';
//     const sort = searchParams.get('sort') || '';
//     const minPrice = parseInt(searchParams.get('minPrice')) || 0;
//     const maxPrice = parseInt(searchParams.get('maxPrice')) || 1000;
//     const category = searchParams.get('category') || '';

//     const searchCriteria = {
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { tags: { $regex: query, $options: 'i' } }
//       ],
//       price: { $gte: minPrice, $lte: maxPrice }
//     };

//     if (category) {
//       // Use 'categoryName' instead of 'category'
//       searchCriteria.categoryName = { $regex: category, $options: 'i' };
//     }

//     let sortOption = {};
//     if (sort === 'latest') {
//       sortOption = { createdAt: -1 };
//     } else if (sort === 'price') {
//       sortOption = { price: 1 };
//     }

//     const products = await Product.find(searchCriteria).sort(sortOption);

//     // Add averageRating and reviewCount to each product
//     const productsWithRating = products.map((product) => {
//       const reviews = product.reviews || [];
//       const averageRating = reviews.length > 0 
//         ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
//         : 0;

//       return {
//         ...product.toObject(),
//         averageRating: averageRating.toFixed(1),
//         reviewCount: reviews.length,
//       };
//     });

//     return NextResponse.json({ products: productsWithRating }, { status: 200 });
//   } catch (error) {
//     console.error('Error retrieving products:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || '';
    const minPrice = parseInt(searchParams.get('minPrice'), 10) || 0;
    const maxPrice = parseInt(searchParams.get('maxPrice'), 10) || 100000;
    const category = searchParams.get('category') || '';

    // Define the search criteria based on the filters
    // const searchCriteria = {
    //   $and: [
    //     // Search products by name, description, or tags using regex
    //     {
    //       $or: [
    //         { name: { $regex: query, $options: 'i' } },
    //         { description: { $regex: query, $options: 'i' } },
    //         { tags: { $regex: query, $options: 'i' } },
    //       ],
    //     },
    //     // Filter products by price range
    //     { price: { $gte: minPrice, $lte: maxPrice } },
        
    //   ],
    // };

    // // Filter by category if provided
    // if (category) {
    //   searchCriteria.categoryName = { $regex: category, $options: 'i' };
    // }

    // Define sorting options based on the 'sort' parameter
    

    // Fetch the products from the database using the search criteria and sorting options
    // const products = await Product.find(searchCriteria).sort(sortOption);


    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      price: { $gte: minPrice, $lte: maxPrice } // Increase maxPrice if needed
    };

    let sortOption = {};
    if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    } else if (sort === 'price') {
      sortOption = { price: 1 };
    }

    
    if (category) {
      searchCriteria.categoryName = { $regex: category, $options: 'i' };
    }
    
    // Optional: Check if displayOptions is being filtered
    const products = await Product.find(searchCriteria).sort(sortOption);

    
    
   


    // Add averageRating and reviewCount to each product
   

    const productsWithRating = products.map((product) => {
      const reviews = product.reviews || [];
      const totalReviews = reviews.length;

      // Calculate average rating if there are reviews
      const averageRating =
        totalReviews > 0
          ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
          : '0.0';

      return {
        ...product.toObject(),
        averageRating,
        reviewCount: totalReviews,
      };
    });

   


    // Return the products with a 200 status
    return NextResponse.json({ products: productsWithRating }, { status: 200 });
   
  
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
