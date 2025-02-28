


// import connectToDatabase from '../../../../../lib/mongodb';
// import Order from '../../../../../models/Order';
// import User from '../../../../../models/User';
// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];

//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
  

//     const { orderItems, totalPrice, shippingAddress, paymentMethod } = await req.json();

//     console.log("orderItems", orderItems)


//     if (!orderItems || !totalPrice || !shippingAddress || !paymentMethod) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

    

//     const newOrder = new Order({
//       user: user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       isPaid: paymentMethod === 'razorpay' ? false : true,
//       paidAt: paymentMethod === 'razorpay' ? null : new Date(),
//       orderStatus: 'Processing',
//     });

   

//     await newOrder.save();

//     return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../../lib/mongodb';
import Order from '../../../../../models/Order';
import Product from '../../../../../models/Product';  // Import the Product model
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;


// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];

//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
  
//     const { orderItems, totalPrice, shippingAddress, paymentMethod } = await req.json();

//     if (!orderItems || !totalPrice || !shippingAddress || !paymentMethod) {
//       return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
//     }

//     // Create the new order
//     const newOrder = new Order({
//       user: user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       totalPrice,
//       isPaid: paymentMethod === 'razorpay' ? false : true,
//       paidAt: paymentMethod === 'razorpay' ? null : new Date(),
//       orderStatus: 'Processing',
//     });

//     await newOrder.save();

//     // Increment salesCount and decrement stock for each product in the orderItems
//     await Promise.all(
//       orderItems.map(async (item) => {
//         const product = await Product.findById(item.product); // Assuming `product` field in `orderItems` refers to product ID
//         if (product) {
//           product.salesCount += item.quantity; // Increment salesCount by the quantity ordered
//           product.stock -= item.quantity; // Decrement stock by the quantity ordered
          
//           // Check if stock goes below 0
//           if (product.stock < 0) {
//             return NextResponse.json({ message: "Not enough stock for product: " + product.name }, { status: 400 });
//           }

//           await product.save();
//         }
//       })
//     );

//     return NextResponse.json({ message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });
//   } catch (error) {
//     console.error('Error placing order:', error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


export async function POST(req) {
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
  
    const { orderItems, totalPrice, shippingAddress, paymentMethod, coupon,  payment_order_id } = await req.json();

    if (!orderItems || !totalPrice || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create the new order
    const newOrder = new Order({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      payment_order_id,
     
      isPaid: paymentMethod === 'razorpay' ? false : true,
      paidAt: paymentMethod === 'razorpay' ? null : new Date(),
      orderStatus: 'Processing',
      coupon, // Include coupon information here
    });

    await newOrder.save();

    // Increment salesCount and decrement stock for each product in the orderItems
    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product); // Assuming `product` field in `orderItems` refers to product ID
        if (product) {
          product.salesCount += item.quantity; // Increment salesCount by the quantity ordered
          product.stock -= item.quantity; // Decrement stock by the quantity ordered
          
          // Check if stock goes below 0
          if (product.stock < 0) {
            return NextResponse.json({ message: "Not enough stock for product: " + product.name }, { status: 400 });
          }

          await product.save();
        }
      })
    );

    return NextResponse.json({ message: "Order placed successfully backend error", orderId: newOrder._id }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}





export async function GET(req) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
