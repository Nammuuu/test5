


// put req for pagedata 

// import connectToDatabase from '../../../../lib/mongodb'; // Adjust the import path as needed
// import User from '../../../../models/User'; // Adjust the import path as needed
// import Pagedata from '../../../../models/Pagedata';

// import jwt from "jsonwebtoken";
// import { NextResponse } from "next/server";

// const JWT_SECRET = process.env.JWT_SECRET;

// export async function PUT(req) {
//   try {
//     await connectToDatabase();

//     // Authorization: Verify JWT
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json(
//         { message: "Unauthorized: Missing or invalid token" },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;

//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     // Parse the request body
//     const body = await req.json();
//     const { section, updates } = body;

//     if (!section || !updates || !updates.title || !updates.descaription) {
//       return NextResponse.json(
//         { message: "Invalid request data: Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Validate section
//     if (!Pagedata.schema.path(section)) {
//       return NextResponse.json(
//         { message: `Invalid section: ${section}` },
//         { status: 400 }
//       );
//     }

//     // Find existing record
//     const pagedata = await Pagedata.findOne() || new Pagedata();

//     const existingSection = pagedata[section] || [];
//     const duplicateIndex = existingSection.findIndex(
//       (entry) =>
//         entry.title === updates.title && entry.descaription === updates.descaription
//     );

//     if (duplicateIndex >= 0) {
//       // Update existing entry
//       existingSection[duplicateIndex] = { ...existingSection[duplicateIndex], ...updates };
//     } else {
//       // Add new entry
//       existingSection.push(updates);
//     }

//     // Save updated data
//     pagedata[section] = existingSection;
//     await pagedata.save();

//     return NextResponse.json({ message: "Data updated successfully", pagedata }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating Pagedata:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../lib/mongodb'; // Adjust the import path as needed
import User from '../../../../models/User'; // Adjust the import path as needed
import Page from '../../../../models/Pagesdata';

// import Pagedata from '../../../../models/Pagesdata';

import { NextResponse } from 'next/server';

// Create a new page
export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, title, content } = await req.json();

    if (!name || !title || !content) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newPage = new Page({ name, title, content });
    await newPage.save();

    return NextResponse.json({ message: 'Page created successfully', page: newPage }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating page', error }, { status: 500 });
  }
}

// Get all pages
export async function GET() {
  try {
    await connectToDatabase();
    const pages = await Page.find();
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching pages', error }, { status: 500 });
  }
}


