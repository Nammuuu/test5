



// Example of a backend API route to get all images from a specific Cloudinary folder
// import { v2 as cloudinary } from 'cloudinary';
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });
  

  import { v2 as cloudinary } from 'cloudinary';
  import { NextResponse } from 'next/server';
  
  // Configure Cloudinary using environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  export async function GET(req) {
    try {
      // Fetch images from the 'blog_images' folder on Cloudinary
      const { resources } = await cloudinary.search
        .expression('folder:blog_images') // Specify the folder
        .sort_by('created_at', 'desc') // Sort by creation date, newest first
        .max_results(30) // Limit the results to 30 images
        .execute();
  
      // Map the resources to return only the necessary data
      const images = resources.map((file) => ({
        public_id: file.public_id,
        secure_url: file.secure_url,
      }));
  
      // Return the images as a JSON response
      return NextResponse.json({ images }, { status: 200 });
    } catch (error) {
      console.error('Error fetching Cloudinary images:', error);
      return NextResponse.json({ message: 'Failed to fetch images' }, { status: 500 });
    }
  }
  
 