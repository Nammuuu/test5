



export const dynamic = 'force-dynamic';

import connectToDatabase from '../../../../../lib/mongodb'; // Adjust the import path as needed
import ThemeSettings from '../../../../../models/ThemeSettings'; // Import the ThemeSettings schema
import User from '../../../../../models/User'; // Adjust the import path as needed
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cloudinaryUploadThamesatting } from '../../../../../lib/cloudinary'; // Adjust import path

// import { cloudinaryUploadprocut } from '../../../../../lib/cloudinary'; 

const JWT_SECRET = process.env.JWT_SECRET;
// GET request to retrieve theme settings
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
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Fetch the theme settings
    const themeSettings = await ThemeSettings.findOne();
    if (!themeSettings) {
      return NextResponse.json({ message: 'Theme settings not found' }, { status: 404 });
    }

    return NextResponse.json({ themeSettings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// // PUT request to update theme settings

// // Convert file to Base64 using Node.js Buffer
// const convertFileToBase64 = async (file) => {
//   const fileBuffer = await file.arrayBuffer();  // Convert file to ArrayBuffer
//   const base64String = Buffer.from(fileBuffer).toString('base64');  // Convert ArrayBuffer to Base64
//   const mimeType = file.type;  // Get the file's MIME type
//   return `data:${mimeType};base64,${base64String}`;  // Return Base64 string with MIME type
// };



// export async function PUT(req) {
//   try {
//     await connectToDatabase(); // Connect to the database

//     // Authorization check
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET); // Verify the JWT
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const userId = decodedToken.userId;

//     // Check if the user is an admin
//     const user = await User.findById(userId);
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ message: "Unauthorized: User not found or not an admin" }, { status: 401 });
//     }

//     const formData = await req.formData();

//     const fontfamily = formData.get("fontfamily");
//     const fontcolor = formData.get("fontcolor");
//     const bgcolor = formData.get("bgcolor");
//     const cardbgcolor = formData.get("cardbgcolor");

//     // Process login logo file if uploaded
//     let loginlogoUrl = null;
//     const loginlogoFile = formData.get("loginlogo");

// // if (loginlogoFile && loginlogoFile.name) { // Ensure the file exists
// //   const loginlogoBase64 = await convertFileToBase64(loginlogoFile);
// //   const uploadResult = await cloudinaryUploadThamesatting(loginlogoBase64, "loginlogo");
// //   loginlogoUrl = uploadResult.secure_url;
// // }


//     // Append the raw login logo file



//     // Process the logo file if it exists
//     // let loginlogoUrl;
//     if (loginlogoFile && loginlogoFile.size > 0) {
//       const loginlogoBase64 = await convertFileToBase64(loginlogoFile);  // Convert file to Base64
//       const uploadResult = await cloudinaryUploadThamesatting(loginlogoBase64, "loginlogo");  // Upload to Cloudinary
//       loginlogoUrl = uploadResult.secure_url;  // Get the secure URL from Cloudinary
//     }

//     // Find and update theme settings
//     let themeSettings = await ThemeSettings.findOne();

//     if (!themeSettings) {
//       themeSettings = new ThemeSettings({
//         fontfamily,
//         fontcolor,
//         bgcolor,
//         cardbgcolor,
//         loginlogo: loginlogoUrl || "",
//       });
//     } else {
//       themeSettings.fontfamily = fontfamily;
//       themeSettings.fontcolor = fontcolor;
//       themeSettings.bgcolor = bgcolor;
//       themeSettings.cardbgcolor = cardbgcolor;
//       if (loginlogoUrl) {
//         themeSettings.loginlogo = loginlogoUrl;  // Update login logo URL if a new one is uploaded
//       }
//     }

//     await themeSettings.save();

//     return NextResponse.json({ themeSettings }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating theme settings:", error);
//     console.log("updating theme settings erro:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }




// Convert file to Base64
const convertFileToBase64 = async (file) => {
  const fileBuffer = await file.arrayBuffer(); // Convert file to ArrayBuffer
  const base64String = Buffer.from(fileBuffer).toString("base64"); // Convert to Base64
  return `data:${file.type};base64,${base64String}`; // Return Base64 string with MIME type
};

export async function PUT(req) {
  try {
    await connectToDatabase(); // Connect to the database

    // Authorization check
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
      decodedToken = jwt.verify(token, JWT_SECRET); // Verify the JWT
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // Check if the user is an admin
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: User not found or not an admin" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const fontfamily = formData.get("fontfamily");
    const fontcolor = formData.get("fontcolor");
    const bgcolor = formData.get("bgcolor");
    const cardbgcolor = formData.get("cardbgcolor");

    // Process login logo file if uploaded
    let loginlogoUrl = null;
    const loginlogoFile = formData.get("loginlogo");

    if (loginlogoFile && loginlogoFile.size > 0) {
      const loginlogoBase64 = await convertFileToBase64(loginlogoFile); // Convert to Base64
      const uploadResult = await cloudinaryUploadThamesatting(
        loginlogoBase64,
        "loginlogo"
      ); // Upload to Cloudinary
      loginlogoUrl = uploadResult.secure_url; // Get the secure URL
    }

    // Find and update theme settings
    let themeSettings = await ThemeSettings.findOne();

    if (!themeSettings) {
      themeSettings = new ThemeSettings({
        fontfamily,
        fontcolor,
        bgcolor,
        cardbgcolor,
        loginlogo: loginlogoUrl || "",
      });
    } else {
      // Update existing settings
      Object.assign(themeSettings, {
        fontfamily,
        fontcolor,
        bgcolor,
        cardbgcolor,
        ...(loginlogoUrl && { loginlogo: loginlogoUrl }), // Only update logo if new file uploaded
      });
    }

    await themeSettings.save();

    return NextResponse.json({ themeSettings }, { status: 200 });
  } catch (error) {
    console.error("Error updating theme settings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



