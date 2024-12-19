

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';  // Assume db.js connects to MongoDB
import Coupons from '../../../../models/Coupons';  // Your Coupons model


export async function GET(req) {
  try {
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    // Check if we are searching for a specific coupon code
    let coupons;
    if (code) {
      coupons = await Coupons.findOne({ code });
      if (!coupons) {
        return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
      }
    } else {
      // Fetch all coupons if no code is provided
      coupons = await Coupons.find();
    }

    return NextResponse.json(coupons, { status: 200 });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ message: 'Error fetching coupons' }, { status: 500 });
  }
}


// GET all coupons


// export async function GET(req) {
//   try {
//     await connectToDatabase();
//     const coupons = await Coupons.find();
//     return NextResponse.json(coupons, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching coupons:', error);
//     return NextResponse.json({ message: 'Error fetching coupons' }, { status: 500 });
//   }
// }

// POST: Add a new coupon
export async function POST(req) {
  try {
    await connectToDatabase();
    const { code, discount, validUntil } = await req.json();

    const newCoupon = new Coupons({
      code,
      discount,
      validUntil
    });

    await newCoupon.save();

    return NextResponse.json({ message: 'Coupon created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ message: 'Error creating coupon' }, { status: 500 });
  }
}

// DELETE: Delete a coupon by ID
export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const deletedCoupon = await Coupons.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Coupon deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ message: 'Error deleting coupon' }, { status: 500 });
  }
}

