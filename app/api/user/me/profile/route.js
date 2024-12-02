
// import { NextResponse } from 'next/server';
// import connectToDatabase from '../../../../../lib/mongodb';
// import UserProfile from '../../../../../models/UserProfile';
// import User from '../../../../../models/User';
// import { cloudinaryUploadcategory } from '../../../../../lib/cloudinary';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

// export async function GET(req) {
//   try {
//     await connectToDatabase();

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
    
//     if (!user) {
//       return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
//     }

//     return NextResponse.json({ userId: user._id }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await connectToDatabase();

//     const formData = await request.formData();
//     const userId = formData.get('userId');

//     if (!userId) {
//       return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//     }

//     // Validate user existence
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     const profilePictureBase64 = formData.get('profilePicture');
//     let profilePictureUrl = '';

//     if (profilePictureBase64) {
//       const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, 'profile_images');
//       profilePictureUrl = uploadResult.secure_url;
//     }

//     // Prepare the updated profile data
//     const updatedProfile = {
//       profilePicture: profilePictureUrl,
//       fullName: formData.get('fullName'),
//       address: formData.get('address'),
//       notificationPreferences: formData.get('notificationPreferences'),
//       savedShippingAddresses: JSON.parse(formData.get('savedShippingAddresses')),
//       billingInfo: JSON.parse(formData.get('billingInfo')),
//       deletedAccountRequest: formData.get('deletedAccountRequest') === 'true',
//     };

//     // Update user profile
//     await UserProfile.findOneAndUpdate(
//       { userId }, // Query to find the document
//       { $set: updatedProfile }, // Fields to update
//       { new: true, upsert: true, runValidators: true } // Options
//     );

//     return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



// import { NextResponse } from 'next/server';
// import connectToDatabase from '../../../../../lib/mongodb';
// import UserProfile from '../../../../../models/UserProfile';
// import User from '../../../../../models/User';
// import { cloudinaryUploadcategory } from '../../../../../lib/cloudinary';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Extract authorization header and validate it
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
//     }

//     // Extract and verify JWT token
//     const token = authHeader.split(' ')[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     // Find the user by ID decoded from token
//     const user = await User.findById(decodedToken.userId);
//     if (!user) {
//       return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
//     }

//     // Find the user's profile using the UserProfile model
//     const userProfile = await UserProfile.findOne({ userId: user._id });

//     if (!userProfile) {
//       return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
//     }

//     // Return the user's profile
//     return NextResponse.json(userProfile, { status: 200 });

//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import UserProfile from '../../../../../models/UserProfile';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

export async function GET(req) {
  try {
    await connectToDatabase();

    // Extract authorization header and validate it
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    // Extract and verify JWT token
    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Find the user by ID decoded from token
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized: User not found' }, { status: 401 });
    }

    // Find the user's profile using the UserProfile model
    const userProfile = await UserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    // Return the user's profile
    return NextResponse.json(userProfile, { status: 200 });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

