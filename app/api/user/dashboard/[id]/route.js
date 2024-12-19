






// just update authka

// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import connectToDatabase from '../../../../../lib/mongodb';
// import User from '../../../../../models/User';
// import Order from '../../../../../models/Order';
// import UserProfile from '../../../../../models/UserProfile';
// import Product from '../../../../../models/Product';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     await connectToDatabase();


//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(id).select('-password');
//     const userProfile = await UserProfile.findOne({ userId: id });
//     const orderHistory = await Order.find({ user: id });
//     const pendingOrders = orderHistory.filter(order => order.orderStatus === 'Processing');




//     return NextResponse.json({
//       user: {
//         ...user.toObject(),
//         ...userProfile.toObject(),
//         orderHistory,
//         pendingOrders,
//         abandonedCarts,
//       }
//     }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import Order from '../../../../../models/Order';
import UserProfile from '../../../../../models/UserProfile';
import Product from '../../../../../models/Product'; // Import Product model for reviews

const JWT_SECRET = process.env.JWT_SECRET;


export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(id).select('-password');
    const userProfile = await UserProfile.findOne({ userId: id });
    
    // Fetch order history with product details and images (media)
    const orderHistory = await Order.find({ user: id }).populate({
      path: 'orderItems.product',
      select: 'name price media' // Select only necessary fields like name, price, and media (image)
    });

    const pendingOrders = orderHistory.filter(order => order.orderStatus === 'Processing');

    // Fetch reviews and populate the associated product details
    const productReviews = await Product.find({ "reviews.user": id }).populate('reviews.user').lean();

    // Format reviews with product details
    const reviews = productReviews.flatMap(product => {
      return product.reviews
        .filter(review => review.user._id.toString() === id)
        .map(review => ({
          ...review,
          product: {
            name: product.name,
            price: product.price,
            media: product.media // Fetch product images
          }
        }));
    });

    return NextResponse.json({
      user: {
        ...user.toObject(),
        ...userProfile.toObject(),
        orderHistory, // Now includes product with media (images)
        pendingOrders,
        reviews, // Include the reviews with product details
      }
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     await connectToDatabase();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(id).select('-password');
//     const userProfile = await UserProfile.findOne({ userId: id });
//     const orderHistory = await Order.find({ user: id });
//     const pendingOrders = orderHistory.filter(order => order.orderStatus === 'Processing');

//     // Fetch reviews and populate the associated product details
//     const productReviews = await Product.find({ "reviews.user": id }).populate('reviews.user').lean();

//     // Format reviews with product details
//     const reviews = productReviews.flatMap(product => {
//       return product.reviews
//         .filter(review => review.user._id.toString() === id)
//         .map(review => ({
//           ...review,
//           product: {
//             name: product.name,
//             price: product.price,
//             media: product.media
//           }
//         }));
//     });

//     return NextResponse.json({
//       user: {
//         ...user.toObject(),
//         ...userProfile.toObject(),
//         orderHistory,
//         pendingOrders,
//         reviews, // Include the reviews with product details
//       }
//     }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }





