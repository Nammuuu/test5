



export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../../lib/mongodb';
import Product from '../../../../../../models/Product';
import User from "../../../../../../models/User";
import { verifyAdmin } from '../../../../../../lib/auth';
import jwt from 'jsonwebtoken';
import Category from "../../../../../../models/Category"
// import { cloudinaryUpload } from '../../../../../../lib/cloudinary';

import { cloudinaryUploadprocut } from '../../../../../../lib/cloudinary';


const JWT_SECRET = process.env.JWT_SECRET;


export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;
    
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decodedToken.userId);
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized: User not found" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Only admins can access this resource" }, { status: 401 });
    }

    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    product.viewsCount += 1;
    await product.save();
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();  // Connect to the database

    // Find the product by ID
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price') ? parseFloat(formData.get('price')) : null;
    const stock = formData.get('stock') ? parseInt(formData.get('stock'), 10) : null;
    const category = formData.get('category');
    const tags = formData.get('tags') ? formData.get('tags').split(',') : [];
    const sizes = formData.get('sizes') ? formData.get('sizes').split(',') : [];
    const colors = formData.get('colors') ? formData.get('colors').split(',') : [];
    const mediaToRemove = formData.getAll('mediaToRemove'); // URLs of media to remove
    const displayOptions = formData.get('displayOptions');

    // Update fields if present
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== null) product.price = price;
    if (stock !== null) product.stock = stock;


    if (category) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        return NextResponse.json({ message: 'Category not found' }, { status: 404 });
      }
      product.category = categoryDoc._id;
    }

    
    if (tags.length) product.tags = tags;
    if (sizes.length) product.sizes = sizes;
    if (colors.length) product.colors = colors;
    if (displayOptions) product.displayOptions = displayOptions;

    // Remove specified media
    if (mediaToRemove.length > 0) {
      product.media = product.media.filter((url) => !mediaToRemove.includes(url));
    }

    // Handle new media (images) upload
    const mediaFiles = formData.getAll('media');
    if (mediaFiles.length > 0) {
      const uploadPromises = mediaFiles.map(async (file) => {
        const fileBlob = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBlob).toString('base64');
        return cloudinaryUploadprocut(`data:${file.type};base64,${fileBase64}`, 'product_images');
      });

      const uploadedImages = await Promise.all(uploadPromises);
      product.media = [...product.media, ...uploadedImages.map((image) => image.url)];
    }

    // Additional fields update (viewsCount, salesCount, and reviews)
    if (formData.has('viewsCount')) {
      product.viewsCount = parseInt(formData.get('viewsCount'), 10);
    }
    if (formData.has('salesCount')) {
      product.salesCount = parseInt(formData.get('salesCount'), 10);
    }
    if (formData.has('reviews')) {
      product.reviews = JSON.parse(formData.get('reviews'));
    }

    await product.save();

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    await product.deleteOne();

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();  // Connect to the database

//     // Find the product by ID
//     const product = await Product.findById(params.id);
//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     // Parse form data
//     const formData = await req.formData();
//     const name = formData.get('name');
//     const description = formData.get('description');
//     const price = formData.get('price') ? parseFloat(formData.get('price')) : null;
//     const stock = formData.get('stock') ? parseInt(formData.get('stock'), 10) : null;
//     const category = formData.get('category');
//     const tags = formData.get('tags') ? formData.get('tags').split(',') : [];
//     const sizes = formData.get('sizes') ? formData.get('sizes').split(',') : [];
//     const colors = formData.get('colors') ? formData.get('colors').split(',') : [];
//     const mediaToRemove = formData.getAll('mediaToRemove'); // URLs of media to remove
//     const displayOptions = formData.get('displayOptions');

//     // Update fields if present
//     if (name) product.name = name;
//     if (description) product.description = description;
//     if (price !== null) product.price = price;
//     if (stock !== null) product.stock = stock;
    
//     // Handle category update
//     if (category) {
//       const categoryDoc = await Category.findOne({ name: category });
//       if (!categoryDoc) {
//         return NextResponse.json({ message: 'Category not found' }, { status: 404 });
//       }
//       product.category = categoryDoc._id;
//     }

//     if (tags.length) product.tags = tags;
//     if (sizes.length) product.sizes = sizes;
//     if (colors.length) product.colors = colors;
//     if (displayOptions) product.displayOptions = displayOptions;

//     // Remove specified media
//     if (mediaToRemove.length > 0) {
//       product.media = product.media.filter((url) => !mediaToRemove.includes(url));
//     }

//     // Handle new media (images) upload
//     const mediaFiles = formData.getAll('media');
//     if (mediaFiles.length > 0) {
//       const uploadPromises = mediaFiles.map(async (file) => {
//         const fileBlob = await file.arrayBuffer();
//         const fileBase64 = Buffer.from(fileBlob).toString('base64');
//         return cloudinaryUploadprocut(`data:${file.type};base64,${fileBase64}`, 'product_images');
//       });

//       const uploadedImages = await Promise.all(uploadPromises);
//       product.media = [...product.media, ...uploadedImages.map((image) => image.url)];
//     }

//     // Additional fields update (viewsCount, salesCount, and reviews)
//     if (formData.has('viewsCount')) {
//       product.viewsCount = parseInt(formData.get('viewsCount'), 10);
//     }
//     if (formData.has('salesCount')) {
//       product.salesCount = parseInt(formData.get('salesCount'), 10);
//     }
//     if (formData.has('reviews')) {
//       product.reviews = JSON.parse(formData.get('reviews'));
//     }

//     await product.save();

//     return NextResponse.json({ product }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



// export async function GET(req, { params }) {
//   try {
//     await connectToDatabase();
    
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     let decodedToken;
    
//     try {
//       decodedToken = jwt.verify(token, JWT_SECRET);
     
//     } catch (error) {
//       return NextResponse.json({ message: "Invalid token" }, { status: 401 });
//     }

//     const user = await User.findById(decodedToken.userId);
    
//     if (!user) {
     
//       return NextResponse.json({ message: "Unauthorized: User not found" }, { status: 401 });
//     }

//     if (user.role !== "admin") {
//       return NextResponse.json({ message: "Unauthorized: Only admins can access this resource" }, { status: 401 });
//     }

//     const product = await Product.findById(params.id);

//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     return NextResponse.json({ product }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();

//     const product = await Product.findById(params.id);
//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     const formData = await req.formData();
//     const name = formData.get('name');
//     const description = formData.get('description');
//     const price = formData.get('price');
//     const stock = formData.get('stock');
//     const category = formData.get('category');
//     const tags = formData.get('tags') ? formData.get('tags').split(',') : [];
//     const sizes = formData.get('sizes') ? formData.get('sizes').split(',') : [];
//     const colors = formData.get('colors') ? formData.get('colors').split(',') : [];
    
//     if (name) product.name = name;
//     if (description) product.description = description;
//     if (price) product.price = price;
//     if (stock) product.stock = stock;
//     if (category) product.category = category;
//     if (tags.length) product.tags = tags;
//     if (sizes.length) product.sizes = sizes;
//     if (colors.length) product.colors = colors;

//     // Handle media (images) upload
//     const mediaFiles = formData.getAll('media');
//     if (mediaFiles.length > 0) {
//       const uploadPromises = mediaFiles.map(async (file) => {
//         const fileBlob = await file.arrayBuffer();
//         const fileBase64 = Buffer.from(fileBlob).toString('base64');
//         return cloudinaryUploadprocut(`data:${file.type};base64,${fileBase64}`, 'product_images');
//       });

//       const uploadedImages = await Promise.all(uploadPromises);
//       product.media = [...product.media, ...uploadedImages];
//     }

//     await product.save();

//     return NextResponse.json({ product }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }
 

// export async function DELETE(req, { params }) {
//   try {
//     await connectToDatabase();
//     const product = await Product.findById(params.id);

//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     await product.deleteOne();

//     return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }




// export async function PUT(req, { params }) {
//   try {
//     await connectToDatabase();

//     const product = await Product.findById(params.id);
//     if (!product) {
//       return NextResponse.json({ message: 'Product not found' }, { status: 404 });
//     }

//     const formData = await req.formData();
//     const name = formData.get('name');
//     const description = formData.get('description');
//     const price = formData.get('price');
//     const stock = formData.get('stock');
//     const category = formData.get('category');
//     const tags = formData.get('tags') ? formData.get('tags').split(',') : [];
//     const sizes = formData.get('sizes') ? formData.get('sizes').split(',') : [];
//     const colors = formData.get('colors') ? formData.get('colors').split(',') : [];
//     const mediaToRemove = formData.getAll('mediaToRemove'); // URLs of media to remove
//     const displayOptions = formData.get('displayOptions');


//     if (name) product.name = name;
//     if (description) product.description = description;
//     if (price) product.price = price;
//     if (stock) product.stock = stock;
//     if (category) product.category = category;
//     if (tags.length) product.tags = tags;
//     if (sizes.length) product.sizes = sizes;
//     if (colors.length) product.colors = colors;
//     if (displayOptions) product.displayOptions = displayOptions;
//     // Filter out the media that the user wants to remove
//     if (mediaToRemove.length > 0) {
//       product.media = product.media.filter((url) => !mediaToRemove.includes(url));
//     }

//     // Handle new media (images) upload
//     const mediaFiles = formData.getAll('media');
//     if (mediaFiles.length > 0) {
//       const uploadPromises = mediaFiles.map(async (file) => {
//         const fileBlob = await file.arrayBuffer();
//         const fileBase64 = Buffer.from(fileBlob).toString('base64');
//         return cloudinaryUploadprocut(`data:${file.type};base64,${fileBase64}`, 'product_images');
//       });

//       const uploadedImages = await Promise.all(uploadPromises);

//       // Concatenate the new images with the existing media
//       product.media = [...product.media, ...uploadedImages.map((image) => image.url)];
//     }

//     await product.save();

//     return NextResponse.json({ product }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }