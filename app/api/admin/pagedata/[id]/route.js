





export const dynamic = 'force-dynamic';
import connectToDatabase from '../../../../../lib/mongodb'; // Adjust the import path as needed
import User from '../../../../../models/User'; // Adjust the import path as needed
import Page from '../../../../../models/Pagesdata';
import { NextResponse } from 'next/server';


// Update a page by ID
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { name, title, content } = await req.json();

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { name, title, content },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Page updated successfully', page: updatedPage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating page', error }, { status: 500 });
  }
}

// Delete a page by ID
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedPage = await Page.findByIdAndDelete(id);

    if (!deletedPage) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting page', error }, { status: 500 });
  }
}
