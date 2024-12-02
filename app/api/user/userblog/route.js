




import connectToDatabase from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

import Blog from '../../../../models/Blog';

export async function GET(req) {
    try {
      await connectToDatabase();  
      // Fetch all blogs
      const blogs = await Blog.find(); // Populate author details if needed
      return NextResponse.json({ blogs }, { status: 200 });
  
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  