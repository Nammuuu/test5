export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import Product from '../../../../../models/Product';
import Category from '../../../../../models/Category';
import { verifyAdmin } from '../../../../../lib/auth';
import jwt from 'jsonwebtoken';
import User from '../../../../../models/User';
// import cloudinary from '../../../../../lib/cloudinary';
import { cloudinaryUploadprocut } from '../../../../../lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET;
export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Extract and verify the authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Check if the user is an admin
    const user = await User.findById(decodedToken.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: Only admins can retrieve products' }, { status: 401 });
    }

    // Fetch all products from the database
    const products = await Product.find({});

    // Return the products as a response
    return NextResponse.json({ message: 'Products retrieved successfully', products }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    await connectToDatabase();

    // Extract form data from the request
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');

    const seles = formData.get('seles');

    const price = parseFloat(formData.get('price'));
    const stock = parseInt(formData.get('stock'), 10);
    // const category = formData.get('category');
    const categoryId = formData.get('categoryId');  // Category ID from frontend
    const categoryName = formData.get('categoryName');

    const tags = JSON.parse(formData.get('tags') || '[]');
    const sizes = JSON.parse(formData.get('sizes') || '[]');
    const colors = JSON.parse(formData.get('colors') || '[]');
    const displayOptions = formData.get('displayOptions');
    const discountPrice = formData.get('discountPrice') ? parseFloat(formData.get('discountPrice')) : null;
    const materials = JSON.parse(formData.get('materials') || '[]');
    const coupons = JSON.parse(formData.get('coupons') || '[]');
    const categoryImage = formData.get('categoryImage');
    const productImages = formData.getAll('productImages');

    const attributes = JSON.parse(formData.get('attributes') || '[]');

    // Validate required fields
    if (!name || !description || !price || !stock || (!categoryId && !categoryName)) {
      return NextResponse.json({ error: 'Missing required fields or category information' }, { status: 400 });
    }
    

    // Check if the category exists by ID
// Check if the category exists by ID
let categoryDoc = await Category.findById(categoryId);
if (!categoryDoc) {
  if (!categoryName) {
    return NextResponse.json({ error: 'Category not found and no category name provided' }, { status: 400 });
  }

  let categoryImageURL = '';
  if (categoryImage) {
    const categoryImageBuffer = Buffer.from(categoryImage, 'base64');
    const categoryImageRes = await cloudinaryUploadprocut(categoryImageBuffer, 'category_images');
    categoryImageURL = categoryImageRes.secure_url;
  }

  // Create a new category if it doesn't exist
  categoryDoc = new Category({
    name: categoryName,  // Use the provided categoryName
    description: `${categoryName} category description`,
    categoryImage: categoryImageURL || '',
    createdAt: new Date(),
  });
  await categoryDoc.save();
}

const uploadedImages = [];
for (const image of productImages) {
  const imageBuffer = Buffer.from(image, 'base64');
  const res = await cloudinaryUploadprocut(imageBuffer, 'product_images');
  uploadedImages.push(res.secure_url);
}


    // Create a new product
    const newProduct = new Product({
      name,
      description,
      seles,
      price,
      stock,
      category: categoryDoc._id,  
  categoryName: categoryDoc.name,
      tags,
      sizes,
      colors,
      attributes,
      displayOptions,
      discountPrice,
      materials,
      coupons,
      media: uploadedImages,
      viewsCount: 0,
      salesCount: 0,
      reviews: [],
      createdAt: new Date(),
    });

    await newProduct.save();

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
