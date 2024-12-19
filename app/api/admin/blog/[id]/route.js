

export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../../lib/mongodb';
// import Order from '../../../../../models/Order';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import Blog from '../../../../../models/Blog';


const JWT_SECRET = process.env.JWT_SECRET;




export async function GET(req, { params }) {
  const { id } = params; // Get blog ID from URL

  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    // Find the blog post by ID
    const blog = await Blog.findById(id).populate('author', 'name email'); // Populate author details
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog fetched successfully', blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  const { id } = params; // Get blog ID from URL
  const { published } = await req.json(); // Get published status from the request body

  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);

    // Update the published status of the blog post
    const blog = await Blog.findByIdAndUpdate(id, { published }, { new: true });
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog status updated', blog }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Get blog ID from URL

  try {
    await connectToDatabase();

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET);

    // Delete the blog post by ID
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
