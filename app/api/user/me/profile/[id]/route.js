


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
// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const { id } = params;
//     const formData = await req.formData();

//     // Fetch existing user profile
//     let existingUserProfile = await UserProfile.findOne({ userId: id });
//     if (!existingUserProfile) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     let profilePictureUrl = existingUserProfile.profilePicture; // Default to existing picture
//     const profilePictureBase64 = formData.get("profilePicture");

//     // Upload new profile picture only if provided and valid
//     // if (profilePictureBase64 && profilePictureBase64.length > 100) {
//     //   const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
//     //   profilePictureUrl = uploadResult.secure_url; // Save new picture URL
//     // } else if (profilePictureBase64 === "") {
//     //   profilePictureUrl = ""; // User removed the profile picture
//     // }

//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       try {
//         const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
//         console.log("Cloudinary Upload Result:", uploadResult);
//         if (uploadResult && uploadResult.secure_url) {
//           profilePictureUrl = uploadResult.secure_url;
//         } else {
//           console.error("Cloudinary Upload Failed:", uploadResult);
//         }
//       } catch (error) {
//         console.error("Error uploading to Cloudinary:", error);
//       }
//     }
    

//     // Extract saved shipping addresses
//     let savedShippingAddresses = [];
//     for (let i = 0; ; i++) {
//       const address = {};
//       const keys = ["address", "address2", "phoneNo", "city", "state", "landmark", "country", "pinCode"];
//       let hasData = false;

//       keys.forEach((key) => {
//         const value = formData.get(`savedShippingAddresses[${i}][${key}]`);
//         if (value) {
//           address[key] = value;
//           hasData = true;
//         }
//       });

//       if (!hasData) break;
//       savedShippingAddresses.push(address);
//     }

//     // Update profile
//     const updatedProfile = {
//       fullName: formData.get("fullName") || "",
//       address: formData.get("address") || "",
//       profilePicture: profilePictureUrl, // ✅ Correctly handled profile picture update
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//       savedShippingAddresses,
//     };

//     // const userProfile = await UserProfile.findOneAndUpdate(
//     //   { userId: id },
//     //   { $set: updatedProfile },
//     //   { new: true, upsert: true, runValidators: true }
//     // );

//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: id },
//       { $set: updatedProfile },
//       { new: true, upsert: true, runValidators: true }
//     );
//     console.log("Updated User Profile:", userProfile);
    

//     return NextResponse.json(userProfile, { status: 200 });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import connectToDatabase from "../../../../../../lib/mongodb";
// import UserProfile from "../../../../../../models/UserProfile";
// import { cloudinaryUploadcategory } from "../../../../../../lib/cloudinary";

import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../lib/mongodb";
import UserProfile from "../../../../../../models/UserProfile";
import { cloudinaryUploadcategory } from "../../../../../../lib/cloudinary";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const formData = await req.formData();

    // ✅ Fetch existing user profile
    let existingUserProfile = await UserProfile.findOne({ userId: id });
    if (!existingUserProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let profilePictureUrl = existingUserProfile.profilePicture; // Default to existing picture
    const profilePictureBase64 = formData.get("profilePicture");

    // ✅ Handle profile picture upload / removal
    if (profilePictureBase64) {
      if (profilePictureBase64.length > 100) {
        try {
          console.log("Uploading profile picture to Cloudinary...");
          const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");

          if (uploadResult?.secure_url) {
            profilePictureUrl = uploadResult.secure_url;
            console.log("Uploaded Profile Picture URL:", profilePictureUrl);
          } else {
            console.error("Cloudinary Upload Failed:", uploadResult);
          }
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        }
      } else if (profilePictureBase64 === "") {
        profilePictureUrl = ""; // ✅ User removed the profile picture
        console.log("Profile picture removed.");
      }
    }

    // ✅ Extract saved shipping addresses
    let savedShippingAddresses = [];
    for (let i = 0; ; i++) {
      const address = {};
      const keys = ["address", "address2", "phoneNo", "city", "state", "landmark", "country", "pinCode"];
      let hasData = false;

      keys.forEach((key) => {
        const value = formData.get(`savedShippingAddresses[${i}][${key}]`);
        if (value) {
          address[key] = value;
          hasData = true;
        }
      });

      if (!hasData) break;
      savedShippingAddresses.push(address);
    }

    // ✅ Ensure fields are properly extracted and updated
    const updatedProfile = {
      fullName: formData.get("fullName")?.trim() || existingUserProfile.fullName || "",
      address: formData.get("address")?.trim() || existingUserProfile.address || "",
      profilePicture: profilePictureUrl, // ✅ Correctly handled profile picture
      deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
      savedShippingAddresses: savedShippingAddresses.length > 0 ? savedShippingAddresses : existingUserProfile.savedShippingAddresses,
    };

    // ✅ Update user profile in DB
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: id },
      { $set: updatedProfile },
      { new: true, upsert: true, runValidators: true }
    );

    console.log("Updated User Profile:", userProfile);

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}




// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const { id } = params;
//     const formData = await req.formData();

//     let profilePictureUrl = "";
//     // const profilePictureBase64 = formData.get("profilePicture");
//     const profilePictureBase64 = formData.get("profilePicture");

//     // ✅ Upload profile picture if provided
//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
//       profilePictureUrl = uploadResult.secure_url;
//     }

//     // ✅ Extract `savedShippingAddresses` properly
//     let savedShippingAddresses = [];
//     for (let i = 0; ; i++) {
//       const address = {};
//       const keys = ["_id", "address", "address2", "phoneNo", "city", "state", "landmark", "country", "pinCode"];
//       let hasData = false;

//       keys.forEach((key) => {
//         const value = formData.get(`savedShippingAddresses[${i}][${key}]`);
//         if (value) {
//           address[key] = value;
//           hasData = true;
//         }
//       });

//       if (!hasData) break; // Stop when no more addresses are found
//       savedShippingAddresses.push(address);
//     }

//     console.log("Parsed savedShippingAddresses:", savedShippingAddresses);

//     // ✅ Construct the updated profile
//     const updatedProfile = {
//       fullName: formData.get("fullName") || "",
//       address: formData.get("address") || "",
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//       savedShippingAddresses, // ✅ Now includes full address objects
//     };

//     // ✅ Ensure profile picture is updated correctly
//     if (profilePictureBase64 === "") {
//       updatedProfile.profilePicture = ""; // Remove picture
//     } else if (profilePictureUrl) {
//       updatedProfile.profilePicture = profilePictureUrl;
//     }

//     console.log("Updating user profile with:", updatedProfile);

//     // ✅ Update MongoDB using `$set`
//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: id },
//       { $set: updatedProfile },
//       { new: true, upsert: true, runValidators: true }
//     );

//     if (!userProfile) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(userProfile, { status: 200 });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
//   }
// }














 