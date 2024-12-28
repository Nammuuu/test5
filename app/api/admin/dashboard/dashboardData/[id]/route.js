




// pages/api/admin/dashboardData/route.js
// import { NextResponse } from 'next/server';
// import connectToDatabase from '@/lib/mongodb'; // Adjust the import path as needed
// import User from '@/models/User';
// import Product from '@/models/Product';
// import Order from '@/models/Order';
// import Category from '@/models/Category';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Check for the authorization header
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
//     }

//     // Parse pagination parameters
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '10', 10);
//     const skip = (page - 1) * limit;

//     // Fetch paginated data for users, products, orders, and categories
//     const users = await User.find().skip(skip).limit(limit);
//     const products = await Product.find().skip(skip).limit(limit);
//     const orders = await Order.find().skip(skip).limit(limit);
//     const categories = await Category.find().skip(skip).limit(limit);

//     // Total counts
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const totalCategories = await Category.countDocuments();

//     // Optionally, calculate additional stats
//     const totalSales = await Order.aggregate([
//       { $match: { isPaid: true } },
//       { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
//     ]);

//     // Prepare the dashboard data with pagination support
//     const dashboardData = {
//       totalUsers,
//       totalProducts,
//       totalOrders,
//       totalCategories,
//       totalSales: totalSales[0]?.totalRevenue || 0,
//       users: { data: users, totalPages: Math.ceil(totalUsers / limit), currentPage: page },
//       products: { data: products, totalPages: Math.ceil(totalProducts / limit), currentPage: page },
//       orders: { data: orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page },
//       categories: { data: categories, totalPages: Math.ceil(totalCategories / limit), currentPage: page },
//     };

//     return NextResponse.json(dashboardData, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Category from '@/models/Category';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Authorization check
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
//     }

//     const token = authHeader.split(' ')[1];
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
//     }

//     // Parse pagination parameters
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '10', 10);
//     const skip = (page - 1) * limit;

//     // Fetch paginated data for users, products, orders, and categories
//     const users = await User.find().skip(skip).limit(limit);
//     const products = await Product.find().skip(skip).limit(limit);
//     const orders = await Order.find().skip(skip).limit(limit);
//     const categories = await Category.find().skip(skip).limit(limit);

//     // Total counts
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const totalCategories = await Category.countDocuments();

//     // Calculate total sales
//     const totalSales = await Order.aggregate([
//       { $match: { isPaid: true } },
//       { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
//     ]);

//     // Fetch total salesCount and viewsCount from all products
// const totalSalesCount = await Product.aggregate([
//   { $group: { _id: null, totalSalesCount: { $sum: "$salesCount" } } }
// ]);

// // totalViewsCount is already aggregated
// const totalViewsCount = await Product.aggregate([
//   { $group: { _id: null, totalViewsCount: { $sum: "$viewsCount" } } }
// ]);



// const dashboardData = {
//   totalUsers,
//   totalProducts,
//   totalOrders,
//   totalCategories,
//   totalSales: totalSales[0]?.totalRevenue || 0,
//   totalSalesCount: totalSalesCount[0]?.totalSalesCount || 0,
//   totalViewsCount: totalViewsCount[0]?.totalViewsCount || 0,
//   users: { data: users, totalPages: Math.ceil(totalUsers / limit), currentPage: page },
//   products: { data: products, totalPages: Math.ceil(totalProducts / limit), currentPage: page },
//   orders: { data: orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page },
//   categories: { data: categories, totalPages: Math.ceil(totalCategories / limit), currentPage: page },
// };


//     // Dashboard data structure
//     // const dashboardData = {
//     //   totalUsers,
//     //   totalProducts,
//     //   totalOrders,
//     //   totalCategories,
//     //   totalSales: totalSales[0]?.totalRevenue || 0,
//     //   users: { data: users, totalPages: Math.ceil(totalUsers / limit), currentPage: page },
//     //   products: { data: products, totalPages: Math.ceil(totalProducts / limit), currentPage: page },
//     //   orders: { data: orders, totalPages: Math.ceil(totalOrders / limit), currentPage: page },
//     //   categories: { data: categories, totalPages: Math.ceil(totalCategories / limit), currentPage: page },
//     // };

//     return NextResponse.json(dashboardData, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching dashboard data:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


// export const dynamic = 'force-dynamic';
// import { NextResponse } from 'next/server';
// import connectToDatabase from '@/lib/mongodb';
// import User from '@/models/User';
// import Product from '@/models/Product';
// import Order from '@/models/Order';
// import Category from '@/models/Category';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET;

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

    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Parse pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch data for orders with status breakdown
    const orderStatuses = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const statusCounts = orderStatuses.reduce((acc, status) => {
      acc[status._id] = status.count;
      return acc;
    }, {});

    const totalOrders = await Order.countDocuments();

    const dashboardData = {
      totalOrders,
      pendingOrders: statusCounts['Pending'] || 0,
      confirmedOrders: statusCounts['Confirmed'] || 0,
      ongoingOrders: statusCounts['Ongoing'] || 0,
      deliveredOrders: statusCounts['Delivered'] || 0,
      canceledOrders: statusCounts['Canceled'] || 0,
      returnedOrders: statusCounts['Returned'] || 0,
      rejectedOrders: statusCounts['Rejected'] || 0,
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}





