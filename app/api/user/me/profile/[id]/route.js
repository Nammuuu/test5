


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb';
import UserProfile from '../../../../../../models/UserProfile';
import User from '../../../../../../models/User';
import { cloudinaryUploaduserprofilepic } from '../../../../../../lib/cloudinary';
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


export async function PUT(req, { params }) {
  try {
    console.log("🔹 API HIT: Updating Profile");
    await connectToDatabase();
    
    const { id } = params;
    console.log("🔹 Updating profile for userId:", id);

    const formData = await req.formData();
    console.log("📥 Received Form Data:", formData);

    let existingUserProfile = await UserProfile.findOne({ userId: id });

    if (!existingUserProfile) {
      console.log("⚠️ No existing profile found, creating a new one.");
      existingUserProfile = new UserProfile({ userId: id });
      await existingUserProfile.save();
    } else {
      console.log("✅ Found existing profile:", existingUserProfile);
    }

    let updates = {};

    // ✅ Debug Profile Picture Handling
    let profilePictureUrl = existingUserProfile.profilePicture;
    const profilePictureBase64 = formData.get("profilePicture");

    console.log("📸 Received Base64 Profile Picture:", profilePictureBase64 ? profilePictureBase64.substring(0, 30) : "No image received");

    if (profilePictureBase64 && profilePictureBase64.length > 100) {
      console.log("🔹 Uploading to Cloudinary...");
      const uploadResult = await cloudinaryUploaduserprofilepic(profilePictureBase64, "profile_images");
      
      if (uploadResult?.secure_url) {
        console.log("✅ Cloudinary Upload Successful:", uploadResult.secure_url);
        profilePictureUrl = uploadResult.secure_url;
      } else {
        console.error("❌ Cloudinary Upload Failed:", uploadResult);
      }
    } else if (profilePictureBase64 === "") {
      console.log("🔹 Removing profile picture.");
      profilePictureUrl = "";
    }
    updates.profilePicture = profilePictureUrl;

    if (formData.has("savedShippingAddresses")) {
      const addresses = JSON.parse(formData.get("savedShippingAddresses"));
      updates.savedShippingAddresses = addresses;
      console.log("✅ Updated Shipping Addresses:", updates.savedShippingAddresses);
    }

    
    // ✅ Debug Other Fields
    if (formData.has("fullName")) {
      updates.fullName = formData.get("fullName").trim();
      console.log("✅ Updated Full Name:", updates.fullName);
    }
    if (formData.has("address")) {
      updates.address = formData.get("address").trim();
      console.log("✅ Updated Address:", updates.address);
    }
    if (formData.has("deletedAccountRequest")) {
      updates.deletedAccountRequest = formData.get("deletedAccountRequest") === "true";
      console.log("✅ Updated Deleted Account Request:", updates.deletedAccountRequest);
    }

    // ✅ Debugging the update query
    console.log("📤 Applying Updates:", updates);

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }  // 🔥 Ensure update happens
    );

    console.log("✅ Final Updated Profile:", updatedProfile);

    return NextResponse.json(updatedProfile, { status: 200 });

  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}



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


 