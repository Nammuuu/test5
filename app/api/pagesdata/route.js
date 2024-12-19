


export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

import Page from '../../../models/Pagesdata';


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name"); // Get the page name from query parameters

    if (!name) {
      return NextResponse.json({ message: "Page name is required" }, { status: 400 });
    }

    await connectToDatabase();

    const pages = await Page.find({ name }); // Find pages by name
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}



// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Extract the section query parameter from the URL
//     const url = new URL(req.url);
//     const section = url.searchParams.get('section');

//     // If a section is specified, fetch only that section
//     if (section) {
//       const pagedata = await Pagedata.findOne({}, { [section]: 1 }); // Only fetch the specified section
//       if (pagedata && pagedata[section]) {
//         return NextResponse.json({ [section]: pagedata[section] }, { status: 200 });
//       } else {
//         return NextResponse.json({ message: `Section ${section} not found` }, { status: 404 });
//       }
//     }

//     // If no section is specified, fetch the entire pagedata object
//     const pagedata = await Pagedata.findOne();
//     return NextResponse.json({ pagedata }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching Pagedata:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


// export async function GET(req) {
//     try {
//       await connectToDatabase();  
//       // Fetch all blogs
//       const pagedata = await Pagedata.find(); 
//       return NextResponse.json({ pagedata }, { status: 200 });
  
//     } catch (error) {
//       console.error('Error fetching Pagedata:', error);
//       return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
//   }
  