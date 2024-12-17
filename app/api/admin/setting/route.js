


import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Settings from '../../../../models/Settings'; // Assume you have a Settings model
import jwt from 'jsonwebtoken';
import User from '../../../../models/User';



const JWT_SECRET = process.env.JWT_SECRET;

// GET: Fetch settings
// export async function GET() {
//   try {
//     await connectToDatabase();
//     const settings = await Settings.findOne(); // Assuming there is only one settings document
//     return NextResponse.json(settings, { status: 200 });
//   } catch (error) {
//     console.error('Failed to fetch settings:', error);
//     return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
//   }
// }


export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all products from the products model
    const settings = await Settings.findOne();

    // Disable caching by setting no-store headers
    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Surrogate-Control': 'no-store',
    });

    // Return the categories as a JSON response
    // return NextResponse.json(settings, { status: 200 });

    return NextResponse.json(
      { message: 'Products retrieved successfully', settings },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}




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
