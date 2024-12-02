



import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';


// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();
//     // Fetch all products from the database
//     const products = await Product.find({});
//     // Return the products as a response
//     return NextResponse.json({ message: 'Products retrieved successfully', products }, { status: 200 });
//   } catch (error) {
//     console.error('Error retrieving products:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


export async function GET(req, { params }) {
  const { id } = params; // Extracting the product ID from the request parameters

  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch the product by ID and populate the reviews
    const product = await Product.findById(id).populate({
      path: 'reviews.user',
      select: 'name profilePictureImagePreview', // Selecting only necessary fields
    });

    // Check if the product is found
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Return the product and its reviews
    return NextResponse.json({ message: 'Product retrieved successfully', product }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}




// export async function GET(req) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Fetch all products and populate the user details for the reviews
//     const products = await Product.find({}).populate({
//       path: 'reviews.user',
//       select: 'name profilePictureImagePreview', // Selecting only necessary fields
//     }); 

//     // Check if products are found
//     if (!products || products.length === 0) {
//       return NextResponse.json({ message: 'No products found' }, { status: 404 });
//     }

//     // Return the products along with their reviews
//     return NextResponse.json({ message: 'Products and reviews retrieved successfully', products }, { status: 200 });
//   } catch (error) {
//     console.error('Error retrieving products and reviews:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



// export async function GET(req) {
//   try {
//     await connectToDatabase();
    
//     const products = await Product.find({}).populate({
//       path: 'reviews.user',
//       select: 'name profilePictureImagePreview',
//     });

//     if (!products || products.length === 0) {
//       return NextResponse.json({ message: 'No products found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Products and reviews retrieved successfully', products }, { status: 200 });
//   } catch (error) {
//     console.error('Error retrieving products and reviews:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// DELETE request to delete a review by productId and reviewId
export async function DELETE(req, { params }) {
  const { productId, reviewId } = params;

  try {
    await connectToDatabase();

    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Find the index of the review to delete
    const reviewIndex = product.reviews.findIndex((review) => review._id.toString() === reviewId);

    if (reviewIndex === -1) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    // Remove the review from the product
    product.reviews.splice(reviewIndex, 1);

    // Recalculate the average rating after the review is deleted
    const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    const numOfReviews = product.reviews.length;
    product.averageRating = numOfReviews === 0 ? 0 : totalRatings / numOfReviews;

    // Save the updated product
    await product.save();

    return NextResponse.json({ message: 'Review deleted successfully', product }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
