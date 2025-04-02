


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
    await connectToDatabase();
    const { id } = params;
    console.log("Updating profile for userId:", id);

    const formData = await req.formData();
    let existingUserProfile = await UserProfile.findOne({ userId: id });

    if (!existingUserProfile) {
      return NextResponse.json({ message: "User profile not found" }, { status: 404 });
    }

    let updates = {};

    // ✅ Handle Profile Picture Upload
    const profilePictureBase64 = formData.get("profilePicture");
    if (profilePictureBase64 && profilePictureBase64.length > 100) {
      const uploadResult = await cloudinaryUploaduserprofilepic(profilePictureBase64, "profile_images");
      if (uploadResult?.secure_url) {
        updates.profilePicture = uploadResult.secure_url;
      }
    }

    // ✅ Handle Selective Updates
    if (formData.has("fullName")) {
      updates.fullName = formData.get("fullName").trim();
    }
    if (formData.has("address")) {
      updates.address = formData.get("address").trim();
    }
    if (formData.has("deletedAccountRequest")) {
      updates.deletedAccountRequest = formData.get("deletedAccountRequest") === "true";
    }

    // ✅ Handle Partial Shipping Address Updates
    if (formData.has("savedShippingAddresses")) {
      let savedShippingAddresses = existingUserProfile.savedShippingAddresses;
      for (let i = 0; i < savedShippingAddresses.length; i++) {
        const phoneNo = formData.get(`savedShippingAddresses[${i}][phoneNo]`);
        if (phoneNo) {
          savedShippingAddresses[i].phoneNo = phoneNo;
        }
      }
      updates.savedShippingAddresses = savedShippingAddresses;
    }

    // ✅ Update Profile in DB
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProfile, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}



// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();
//     const { id } = params;
//     console.log("Updating profile for userId:", id);

//     const formData = await req.formData();

//     let existingUserProfile = await UserProfile.findOne({ userId: id });

//     if (!existingUserProfile) {
//       existingUserProfile = new UserProfile({ userId: id });
//       await existingUserProfile.save();
//     }

//     let profilePictureUrl = existingUserProfile.profilePicture;

//     // Profile picture handling
//     const profilePictureBase64 = formData.get("profilePicture");
//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       const uploadResult = await cloudinaryUploaduserprofilepic(profilePictureBase64, "profile_images");
//       if (uploadResult?.secure_url) {
//         profilePictureUrl = uploadResult.secure_url;
//       }
//     } else if (profilePictureBase64 === "") {
//       profilePictureUrl = "";
//     }

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

//     const updatedProfile = {
//       fullName: formData.get("fullName")?.trim() || existingUserProfile.fullName,
//       address: formData.get("address")?.trim() || existingUserProfile.address,
//       profilePicture: profilePictureUrl !== existingUserProfile.profilePicture ? profilePictureUrl : existingUserProfile.profilePicture,
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//       savedShippingAddresses: savedShippingAddresses.length > 0 ? savedShippingAddresses : existingUserProfile.savedShippingAddresses,
//     };

//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: id },
//       updatedProfile,
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json(userProfile, { status: 200 });

//   } catch (error) {
//     return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
//   }
// }



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
//     console.log("Updating profile for userId:", id);

//     const formData = await req.formData();

//     // ✅ Ensure user profile exists
//     let existingUserProfile = await UserProfile.findOne({ userId: id });

//     if (!existingUserProfile) {
//       console.log("User profile not found. Creating a new one...");
//       existingUserProfile = new UserProfile({ userId: id });
//       await existingUserProfile.save();
//     }

//     let profilePictureUrl = existingUserProfile.profilePicture;
   

//     // ✅ Handle profile picture upload
//     const profilePictureBase64 = formData.get("profilePicture");
//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       try {
//         console.log("Uploading profile picture to Cloudinary...");
//         const uploadResult = await cloudinaryUploaduserprofilepic(profilePictureBase64, "profile_images");
//         if (uploadResult?.secure_url) {
//           profilePictureUrl = uploadResult.secure_url;
//           console.log("Uploaded Profile Picture URL:", profilePictureUrl);
//         }
//       } catch (error) {
//         console.error("Error uploading to Cloudinary:", error);
//       }
//     } else if (profilePictureBase64 === "") {
//       profilePictureUrl = "";
//       console.log("Profile picture removed.");
//     }
    

//     // ✅ Extract saved shipping addresses
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
//     const updatedProfile = {
//       fullName: formData.get("fullName")?.trim() || existingUserProfile.fullName || "",
//       address: formData.get("address")?.trim() || existingUserProfile.address || "",
//       profilePicture: profilePictureUrl, // Ensure profile picture is updated
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//       savedShippingAddresses: savedShippingAddresses.length > 0 ? savedShippingAddresses : [], // Force update
//     };
    

//     // ✅ Update user profile in DB
//     // const userProfile = await UserProfile.findOneAndUpdate(
//     //   { userId: id },
//     //   { $set: updatedProfile },
//     //   { new: true, upsert: true, runValidators: true }
//     // );
//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: id },
//       { $set: updatedProfile },
//       { new: true, upsert: true, runValidators: true }
//     ).lean(); // Convert Mongoose document to plain JSON
    

//     if (userProfile) {
//       await userProfile.save();
//     }
    

//     console.log("Updated User Profile:", userProfile);
//     return NextResponse.json(userProfile, { status: 200 });

//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
//   }
// }
 