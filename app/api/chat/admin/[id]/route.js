
 


import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Chat from '@/models/Chat'; // Import your Chat model
import User from '@/models/User'; // Assuming User is your model for admin

const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
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
  
  
      const user = await User.findById(decodedToken.userId);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
      }
  
  
      const { userId } = params; // Extract userId from request params
  
      if (!userId) {
        return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
      }


      // Delete all chat messages of this user
      // await Chat.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
  
      const result = await Chat.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "No chats found for the specified user" },
        { status: 404 }
      );
    }

    
      return NextResponse.json({ message: 'User chats deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting user chats:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  