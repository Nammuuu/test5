


import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Settings from '../../../../models/Settings'; // Assume you have a Settings model
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';



const JWT_SECRET = process.env.JWT_SECRET;

// GET: Fetch settings
export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Settings.findOne(); // Assuming there is only one settings document
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}

// export async function PUT(req) {
//   try {
//     await connectToDatabase(); // Connect to your database

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

//     // Find user and check if they are admin (assuming you have a User model and roles)
//     const user = await User.findById(userId);
//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
//     }

//     // Get data from the request body
   
//     const {
//         enableCOD,
//         enableStripe,
//         stripeKey,
//         stripeSecret,
//         enableRazorPay,
//         enableGoogleAnalytics,
//         googleAnalyticsKey,
//         themeColor,
//         shopName,
//         companyName,
//         address,
//         postCode,
//         contact,
//         email,
//         website,
//         font,
//         contrastLayout,
//         razorPayKey, 
//         razorPaySecret,

//         enablePayPal, // PayPal fields
//       payPalClientId,
//       payPalSecret,
//       } = await req.json() || {};  // Ensure you have fallback in case fields are missing
      
    
//     // Find the settings document (assuming you have only one document)
//     let settings = await Settings.findOne();
//     if (!settings) {
//       // Create new settings if they don't exist
//       settings = new Settings({});
//     }

//     // Update the settings document
//     settings.enableCOD = enableCOD;
//     settings.enableStripe = enableStripe;
//     settings.stripeKey = stripeKey;
//     settings.stripeSecret = stripeSecret;
//     settings.enableRazorPay = enableRazorPay;
//     settings.enableGoogleAnalytics = enableGoogleAnalytics;
//     settings.googleAnalyticsKey = googleAnalyticsKey;
//     settings.themeColor = themeColor;
//     settings.shopName = shopName;
//     settings.companyName = companyName;
//     settings.address = address;
//     settings.postCode = postCode;
//     settings.contact = contact;
//     settings.email = email;
//     settings.website = website;
//     settings.font = font;
//     settings.contrastLayout = contrastLayout;
//     settings.razorPayKey = razorPayKey; // Make sure this line is executed
//     settings.razorPaySecret = razorPaySecret;

//     try {
//         console.log("Before Save - razorPayKey:", settings.razorPayKey);  // Log before save
//         console.log("Before Save - razorPaySecret:", settings.razorPaySecret);
      
//         await settings.save();  // Try saving the document
      
//         console.log("Settings saved successfully!");
//       } catch (error) {
//         console.error("Error saving settings:", error);  // Log any error that occurs during saving
// }

      
//     // await settings.save(); // Save the updated settings

//     return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating settings:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }




// POST: Save settings
// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
//     if (!user || user.role !== "admin") {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     let settings = await Settings.findOne();

//     if (!settings) {
//       settings = new Settings(body);
//     } else {
//       settings.set(body); // Update settings if they exist
//     }

//     await settings.save();
//     return NextResponse.json({ message: "Settings saved successfully" }, { status: 200 });
//   } catch (error) {
//     console.error('Failed to save settings:', error);
//     return NextResponse.json({ message: "Failed to save settings" }, { status: 500 });
//   }
// }


// add paypal ok 


export async function PUT(req) {
  try {
    await connectToDatabase(); // Connect to your database

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
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
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Parse data from request
    const {
      enableCOD,
      enableStripe,
      stripeKey,
      stripeSecret,
      enableRazorPay,
      razorPayKey,
      razorPaySecret,
      enableGoogleAnalytics,
      googleAnalyticsKey,
      themeColor,
      shopName,
      companyName,
      address,
      postCode,
      contact,
      email,
      website,
      font,
      contrastLayout,
      enablePayPal, // PayPal fields
      payPalClientId,
      payPalSecret,
      facebook,
      instagram,
      twitter,
      youtube,
    } = await req.json();

    // Find the settings document or create a new one
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    // Update the settings document
    settings.enableCOD = enableCOD;
    settings.enableStripe = enableStripe;
    settings.stripeKey = stripeKey;
    settings.stripeSecret = stripeSecret;
    settings.enableRazorPay = enableRazorPay;
    settings.razorPayKey = razorPayKey;
    settings.razorPaySecret = razorPaySecret;
    settings.enableGoogleAnalytics = enableGoogleAnalytics;
    settings.googleAnalyticsKey = googleAnalyticsKey;
    settings.themeColor = themeColor;
    settings.shopName = shopName;
    settings.companyName = companyName;
    settings.address = address;
    settings.postCode = postCode;
    settings.contact = contact;
    settings.email = email;
    settings.website = website;

    settings.facebook = facebook;
    settings.instagram = instagram;
    settings.twitter = twitter;
    settings.youtube = youtube;

    settings.font = font;
    settings.contrastLayout = contrastLayout;
    settings.enablePayPal = enablePayPal;
    settings.payPalClientId = payPalClientId;
    settings.payPalSecret = payPalSecret;

    // Save the updated settings
    await settings.save();

    return NextResponse.json({ message: "Settings updated successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
