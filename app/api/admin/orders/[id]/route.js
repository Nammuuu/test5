


import connectToDatabase from '../../../../../lib/mongodb';
import Order from '../../../../../models/Order';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;


// GET request to fetch order by ID
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
  
      const userId = decodedToken.userId;
      const { id } = params;
  
      // Find the order by ID
      // const order = await Order.findById(id);
      

      const order = await Order.findById(id).populate({
        path: 'orderItems.product',
        select: 'name price media', // Ensure 'media' field is populated
      });
      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }

  
      // Check if user is admin
      const user = await User.findById(userId);

      if (!user || user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
      }
      
      
  
      // Return the order details
      return NextResponse.json({ order }, { status: 200 });
    } catch (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }





export async function PUT(req, { params }) {
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

    const userId = decodedToken.userId;
    const { id } = params;
    const { orderStatus } = await req.json();

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Check if user is admin
    const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Update the order status
    order.orderStatus = orderStatus;
    await order.save();

    return NextResponse.json({ message: 'Order status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



export async function DELETE(req, { params }) {
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
  
      const userId = decodedToken.userId;
      const { id } = params;
    
      // Find the order by ID
      const order = await Order.findById(id);
      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
    
      // Check if user is admin
      const user = await User.findById(userId);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
      }
    
      // Delete the order using deleteOne() or findByIdAndDelete()
      await Order.deleteOne({ _id: id }); // or you can use await Order.findByIdAndDelete(id);
    
      return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting order:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  
