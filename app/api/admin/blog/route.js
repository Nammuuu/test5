






export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../lib/mongodb';
// import Order from '../../../../../models/Order';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';


import Blog from '../../../../models/Blog';

const JWT_SECRET = process.env.JWT_SECRET;
// Create a new blog post
export async function POST(req) {
  try {
    await connectToDatabase();
    const { title, heading, content, images, urlSlug, metaDescription, metaKeywords, author } = await req.json();

    const newBlog = new Blog({
      title,
      heading,
      content,
      images,
      urlSlug,
      metaDescription,
      metaKeywords,
      author, // Assuming the author ID is passed in the request body
    });

    await newBlog.save();
    return NextResponse.json({ message: 'Blog created successfully', blog: newBlog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating blog', error }, { status: 500 });
  }
}

// Get all blogs


export async function GET(req) {
  try {
    await connectToDatabase();

    // Authorization check
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Check if user is admin
    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }

    // Fetch all blogs
    const blogs = await Blog.find().populate('author', 'name'); // Populate author details if needed
    return NextResponse.json({ blogs }, { status: 200 });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// Update blog
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const updatedData = await req.json();

    const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog updated successfully', blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating blog', error }, { status: 500 });
  }
}

// Delete blog
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting blog', error }, { status: 500 });
  }
}


