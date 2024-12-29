


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    await connectToDatabase();

    // Authorization check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch orders with status breakdown
    const orderStatuses = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const statusCounts = orderStatuses.reduce((acc, status) => {
      acc[status._id] = status.count;
      return acc;
    }, {});

    // Fetch paginated order data
    const orders = await Order.find().skip(skip).limit(limit);
    const totalOrders = await Order.countDocuments();

    // Structure the response
    const dashboardData = {
      totalOrders,
      processing: statusCounts["Processing"] || 0,
      pending: statusCounts["Pending"] || 0,
      shipped: statusCounts["Shipped"] || 0,
      delivered: statusCounts["Delivered"] || 0,
      canceled: statusCounts["Cancelled"] || 0,
      orders: {
        data: orders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
      },
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}