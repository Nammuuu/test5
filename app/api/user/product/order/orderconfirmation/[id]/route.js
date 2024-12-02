






// import connectToDatabase from '../../../../../../../lib/mongodb';
// import Order from '../../../../../../../models/Order';
// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

// export async function GET(req, { params }) {
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

//     const orderId = params.id; // Fetch the order ID from params
//     const order = await Order.findById(orderId).populate('user'); // Assuming 'user' is a reference in Order schema

//     if (!order) {
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 });
//     }

//     // Verify if the order belongs to the requesting user
//     if (order.user._id.toString() !== decodedToken.userId) {
//       return NextResponse.json({ message: 'Unauthorized: You do not have access to this order' }, { status: 401 });
//     }

//     return NextResponse.json({ order }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



import connectToDatabase from '../../../../../../../lib/mongodb';
import Order from '../../../../../../../models/Order';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import Product from '../../../../../../../models/Product';

const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(req, { params }) {
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

//     const orderId = params.id; // Fetch the order ID from params
//     // Populate 'orderItems.product' to get product details such as name, media, price, etc.
//     const order = await Order.findById(orderId)
//       .populate({
//         path: 'orderItems.product', // Assuming orderItems has a reference to Product model
//         select: 'name media price', // Specify the fields to include
//       })
//       .populate('user'); // Populate user details as needed

//     if (!order) {
//       return NextResponse.json({ message: 'Order not found' }, { status: 404 });
//     }

//     // Verify if the order belongs to the requesting user
//     if (order.user._id.toString() !== decodedToken.userId) {
//       return NextResponse.json({ message: 'Unauthorized: You do not have access to this order' }, { status: 401 });
//     }

//     return NextResponse.json({ order }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



export async function GET(req, { params }) {
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

    const orderId = params.id; // Fetch the order ID from params
    // Populate 'orderItems.product' to get product details such as name, media, price, etc.
    const order = await Order.findById(orderId)
      .populate({
        path: 'orderItems.product', // Assuming orderItems has a reference to Product model
        select: 'name media price', // Specify the fields to include
      })
      .populate('user'); // Populate user details as needed

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Verify if the order belongs to the requesting user
    if (order.user._id.toString() !== decodedToken.userId) {
      return NextResponse.json({ message: 'Unauthorized: You do not have access to this order' }, { status: 401 });
    }

    // Include coupon details in the response
    const orderDetails = {
      ...order.toObject(),
      coupon: order.coupon || null // Include coupon information if available
    };

    return NextResponse.json({ order: orderDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { quantity } = await req.json(); // Get the quantity from the request body

    // Find the product and increment salesCount based on quantity
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    product.salesCount += quantity; // Increment by quantity purchased
    await product.save(); // Save the changes to the database

    return NextResponse.json({ message: 'Sales count incremented' }, { status: 200 });
  } catch (error) {
    console.error('Error incrementing sales count:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


