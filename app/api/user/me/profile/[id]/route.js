


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb';
import UserProfile from '../../../../../../models/UserProfile';
import User from '../../../../../../models/User';
import { cloudinaryUploadcategory } from '../../../../../../lib/cloudinary';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a JWT_SECRET in your .env file

export async function GET(req, { params }) {
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
      console.error('Error verifying token:', error);
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userProfile = await UserProfile.findOne({ userId: decodedToken.userId });
    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// DELETE User Profile
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    const userProfile = await UserProfile.findOneAndDelete({ userId: id });

    if (!userProfile) {
      return NextResponse.json({ message: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User profile deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT Update User Profile
// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();

//     const { id } = params;
//     const formData = await req.formData();

//     const profilePictureBase64 = formData.get('profilePicture');
//     let profilePictureUrl = '';

//     if (profilePictureBase64) {
//       const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, 'profile_images');
//       console.log("Upload Result:", uploadResult); 
//       profilePictureUrl = uploadResult.secure_url;
//     }

//     const updatedProfile = {
//       // profilePicture: profilePictureUrl,
//       // fullName: formData.get('fullName'),
     
//       // // notificationPreferences: formData.get('notificationPreferences'),
//       // savedShippingAddresses: JSON.parse(formData.get('savedShippingAddresses')),
     
//       // deletedAccountRequest: formData.get('deletedAccountRequest') === 'true',
//       fullName: formData.get('fullName') || "",
//       address: formData.get('address') || "",
//       savedShippingAddresses: JSON.parse(formData.get('savedShippingAddresses') || "[]"),
//       deletedAccountRequest: formData.get('deletedAccountRequest') === 'true',
//     };

//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: id },
//       { $set: updatedProfile },
//       { new: true, upsert: true, runValidators: true }
//     );

//     return NextResponse.json(userProfile, { status: 200 });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }





export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const formData = await req.formData();

    const profilePictureBase64 = formData.get("profilePicture");
    let profilePictureUrl = "";

    // Upload to Cloudinary if there's a valid base64 image
    if (profilePictureBase64 && profilePictureBase64.length > 100) {
      const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
      profilePictureUrl = uploadResult.secure_url;
    }

    // Convert formData values properly
    const updatedProfile = {
      fullName: formData.get("fullName") || "",
      address: formData.get("address") || "",
      savedShippingAddresses: formData.get("savedShippingAddresses")
        ? JSON.parse(formData.get("savedShippingAddresses"))
        : [],
      deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
    };

    // If profile picture is empty, remove it
    if (profilePictureBase64 === "") {
      updatedProfile.profilePicture = "";
    } else if (profilePictureUrl) {
      updatedProfile.profilePicture = profilePictureUrl;
    }

    console.log("Updating user profile with:", updatedProfile);

    // Ensure all fields are updated correctly
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: id },
      {
        $set: {
          fullName: updatedProfile.fullName,
          address: updatedProfile.address,
          profilePicture: updatedProfile.profilePicture,
          deletedAccountRequest: updatedProfile.deletedAccountRequest,
          savedShippingAddresses: updatedProfile.savedShippingAddresses, // Properly setting array
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}




 