


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb';
import Product from '../../../../../../models/Product';

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregate unique tags
    const tags = await Product.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
      { $project: { _id: 0, tags: '$uniqueTags' } }
    ]);

    return NextResponse.json({ tags: tags[0]?.tags || [] }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



