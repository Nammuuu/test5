


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

//     let profilePictureUrl = "";
//     const profilePictureBase64 = formData.get("profilePicture");

//     // Upload to Cloudinary if it's a valid Base64 string
//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
//       profilePictureUrl = uploadResult.secure_url;
//     }

//     const updatedProfile = {
//       fullName: formData.get("fullName") || "",
//       address: formData.get("address") || "",
//       savedShippingAddresses: JSON.parse(formData.get("savedShippingAddresses") || "[]"),
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//     };

//     // Ensure profile picture is updated properly
//     if (profilePictureBase64 === "") {
//       updatedProfile.profilePicture = ""; // Remove profile picture
//     } else if (profilePictureUrl) {
//       updatedProfile.profilePicture = profilePictureUrl; // Set new picture
//     }

//     console.log("Updating user profile with:", updatedProfile);

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
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }


// PUT Update User Profile


export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const formData = await req.formData();

    console.log("Received FormData:", Object.fromEntries(formData)); // ✅ Debugging

    let profilePictureUrl = "";
    const profilePictureBase64 = formData.get("profilePicture");

    // ✅ Upload profile picture if provided
    if (profilePictureBase64 && profilePictureBase64.length > 100) {
      const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
      profilePictureUrl = uploadResult.secure_url;
    }

    // ✅ Parse `savedShippingAddresses`
    let savedShippingAddresses = [];
    for (let i = 0; ; i++) {
      const address = {};
      const keys = ["_id", "address", "address2", "phoneNo", "city", "state", "landmark", "country", "pinCode"];
      let hasData = false;

      keys.forEach((key) => {
        const value = formData.get(`savedShippingAddresses[${i}][${key}]`);
        if (value) {
          address[key] = value;
          hasData = true;
        }
      });

      if (!hasData) break; // Stop when no more addresses are found
      savedShippingAddresses.push(address);
    }

    console.log("Parsed savedShippingAddresses:", savedShippingAddresses);

    // ✅ Construct the updated profile
    const updatedProfile = {
      fullName: formData.get("fullName") || "",
      address: formData.get("address") || "",
      deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
    };

    // ✅ Ensure existing addresses are updated, and new ones are added
    const userProfile = await UserProfile.findOne({ userId: id });

    if (!userProfile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Update existing addresses & add new ones
    savedShippingAddresses.forEach((newAddress) => {
      const existingAddressIndex = userProfile.savedShippingAddresses.findIndex(
        (addr) => addr._id.toString() === newAddress._id
      );

      if (existingAddressIndex !== -1) {
        userProfile.savedShippingAddresses[existingAddressIndex] = newAddress; // ✅ Update existing
      } else {
        userProfile.savedShippingAddresses.push(newAddress); // ✅ Add new
      }
    });

    // ✅ Handle profile picture updates
    if (profilePictureBase64 === "") {
      updatedProfile.profilePicture = ""; // Remove picture
    } else if (profilePictureUrl) {
      updatedProfile.profilePicture = profilePictureUrl;
    }

    // ✅ Save updated user profile
    userProfile.set(updatedProfile);
    await userProfile.save();

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

//     console.log("Received formData:", formData);

//     let profilePictureUrl = "";
//     const profilePictureBase64 = formData.get("profilePicture");

//     // Upload only if valid Base64
//     if (profilePictureBase64 && profilePictureBase64.length > 100) {
//       const uploadResult = await cloudinaryUploadcategory(profilePictureBase64, "profile_images");
//       profilePictureUrl = uploadResult.secure_url;
//     }

//     // Convert `savedShippingAddresses` safely
//     let savedShippingAddresses = [];
//     try {
//       savedShippingAddresses = formData.get("savedShippingAddresses")
//         ? JSON.parse(formData.get("savedShippingAddresses"))
//         : [];
//     } catch (error) {
//       console.error("Error parsing savedShippingAddresses:", error);
//       return NextResponse.json({ message: "Invalid savedShippingAddresses format" }, { status: 400 });
//     }

//     const updatedProfile = {
//       fullName: formData.get("fullName") || "",
//       address: formData.get("address") || "",
//       savedShippingAddresses: Array.isArray(savedShippingAddresses) ? savedShippingAddresses : [],
//       deletedAccountRequest: formData.get("deletedAccountRequest") === "true",
//     };

//     // Ensure profile picture is updated correctly
//     if (profilePictureBase64 === "") {
//       updatedProfile.profilePicture = "";
//     } else if (profilePictureUrl) {
//       updatedProfile.profilePicture = profilePictureUrl;
//     }

//     console.log("Updating user profile with:", updatedProfile);

//     // Update user profile
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











 