


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
// import UserProfile from '../../../models/UserProfile';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

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
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Check if the request is for the user ID only
    // if (req.url.endsWith('/me')) {
    //   return NextResponse.json({ userId: user._id }, { status: 200 });
    // }

    // If the request is for the profile
    // const userProfile = await UserProfile.findOne({ userId: user._id });

    if (!user) {
      return NextResponse.json({ message: 'User  not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
