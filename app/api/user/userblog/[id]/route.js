

import connectToDatabase from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import Blog from '../../../../../models/Blog';
 


// export async function GET(req, { params }) {
//     const { id } = params;
    
//     try {
//         // Connect to the database
//         await connectToDatabase();
        
//         // Fetch the product by ID from the database
//         const product = await Product.findById(id);
        
//         if (!product) {
//             return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//         }
        
//         // Return the product as a response
//         return NextResponse.json({ message: 'Product retrieved successfully', product }, { status: 200 });
//     } catch (error) {
//         console.error('Error retrieving product:', error);
//         return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//     }
//   }

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        const { id } = params;
        
        // Fetch the blog using the URL slug (or _id if needed)

        const blog = await Blog.findById(id);
        //  const blog = await Blog.findOne({ urlSlug: id }).populate('author', 'name');
        
        if (!blog) {
            return NextResponse.json({ message: 'Blog not found api work' }, { status: 404 });
        }

        return NextResponse.json({ blog }, { status: 200 });

    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
