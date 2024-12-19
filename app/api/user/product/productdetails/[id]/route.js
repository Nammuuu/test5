export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb';
import Product from '../../../../../../models/Product';

export async function GET(req, { params }) {
    const { id } = params;
    
    try {
        // Connect to the database
        await connectToDatabase();
        
        // Fetch the product by ID from the database
        const product = await Product.findById(id);
        
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Increment the views count
    product.viewsCount += 1;
    await product.save();
        
        // Return the product as a response
        return NextResponse.json({ message: 'Product retrieved successfully', product }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving product:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}



