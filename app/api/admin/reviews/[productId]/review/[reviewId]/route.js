


import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../../lib/mongodb';
import Product from '../../../../../../../models/Product';


export async function GET(req) {
  try {
    await connectToDatabase();
    
    const products = await Product.find({}).populate({
      path: 'reviews.user',
      select: 'name profilePictureImagePreview',
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Products and reviews retrieved successfully', products }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving products and reviews:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// File: /api/admin/reviews/[productId]/review/[reviewId]/route.js


export async function DELETE(req, { params }) {
  const { productId, reviewId } = params;

  try {
    await connectToDatabase();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const reviewIndex = product.reviews.findIndex((review) => review._id.toString() === reviewId);
    if (reviewIndex === -1) {
      return NextResponse.json({ message: 'Review not found' }, { status: 404 });
    }

    console.log("Received productId:", productId);
console.log("Received reviewId:", reviewId);


    product.reviews.splice(reviewIndex, 1);
    // Recalculate average rating
    const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = product.reviews.length ? totalRatings / product.reviews.length : 0;

    await product.save();

    return NextResponse.json({ message: 'Review deleted successfully', product }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}




// DELETE request to delete a review by productId and reviewId
// export async function DELETE(req, { params }) {
//   const { productId, reviewId } = params;

//   try {
//     await connectToDatabase();

//     // Find the product by productId
//     const product = await Product.findById(productId);

//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     // Find the index of the review to delete
//     const reviewIndex = product.reviews.findIndex((review) => review._id.toString() === reviewId);

//     if (reviewIndex === -1) {
//       return NextResponse.json({ message: 'Review not found' }, { status: 404 });
//     }

//     // Remove the review from the product
//     product.reviews.splice(reviewIndex, 1);

//     // Recalculate the average rating after the review is deleted
//     const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
//     const numOfReviews = product.reviews.length;
//     product.averageRating = numOfReviews === 0 ? 0 : totalRatings / numOfReviews;

//     // Save the updated product
//     await product.save();

//     return NextResponse.json({ message: 'Review deleted successfully', product }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }