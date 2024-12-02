


import connectToDatabase from "../../../../../../lib/mongodb";
import Order from "../../../../../../models/Order";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { status } = await req.json();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Ensure the user is an admin
    if (decodedToken.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can perform this action" },
        { status: 403 }
      );
    }

    // Update order status
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order status updated", order },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
