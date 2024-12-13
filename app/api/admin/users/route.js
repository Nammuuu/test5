

import connectToDatabase from '../../../../lib/mongodb'; // Adjust the import path as needed
import User from '../../../../models/User'; // Adjust the import path as needed
import UserProfile from '../../../../models/UserProfile'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

 const JWT_SECRET = process.env.JWT_SECRET;

 export async function GET(req) {
  try {
    await connectToDatabase();

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      // Verify the token
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch the user from the token
    const user = await User.findById(decodedToken.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Fetch all users with their profiles
    const users = await User.find({}).select('username email phoneNumber role'); // Adjust the fields as needed

    // Optionally populate additional user profile details if required
    // const users = await User.find({}).populate('profile'); // Uncomment if using populate

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



export async function DELETE(req) {
  try {
    await connectToDatabase();

    // Extract user ID from query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      // Verify the token
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch the user from the token
    const admin = await User.findById(decodedToken.userId);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Delete the user and their profile
    await User.findByIdAndDelete(userId);
    await UserProfile.findOneAndDelete({ userId });

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



export async function PUT(req) {
    try {
      await connectToDatabase();
  
      // Get the authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
      }
  
      // Extract token from the header
      const token = authHeader.split(' ')[1];
      let decodedToken;
  
      try {
        // Verify the token
        decodedToken = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
  
      // Fetch the user from the token
      const admin = await User.findById(decodedToken.userId);
  
      if (!admin || admin.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
      }
  
      const { userId, username, email, phoneNumber, role } = await req.json();
  


      if (role && !['user', 'admin'].includes(role)) {
        return NextResponse.json({ message: 'Invalid role value' }, { status: 400 });
      }
      // Update the user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, phoneNumber, role },
        { new: true } // Return the updated document
      );
  
      return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  