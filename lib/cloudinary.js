// import { v2 as cloudinary } from 'cloudinary';

// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export default cloudinary;


// import cloudinary from 'cloudinary';
// // import { v2 as cloudinary } from 'cloudinary';

// cloudinary.v2.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });


// export const cloudinaryUpload = async (fileBase64, folder) => {
//   try {
//     const res = await cloudinary.v2.uploader.upload(`data:image/png;base64,${fileBase64}`, {
//       folder: folder,
//     });
//     return res;
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw error;
//   }
// };




import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { Buffer } from 'buffer';
// import cloudinary  from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = async (file, folder) => {
  try {
    let result;
    if (file.startsWith('data:')) {
      // Base64 string
      result = await cloudinary.uploader.upload(file, {
        folder: folder,
        resource_type: 'image', // Ensure this is set to 'image' for images
      });
    } else {
      // URL or file path
      result = await cloudinary.uploader.upload(file, {
        folder: folder,
        resource_type: 'image', // Ensure this is set to 'image' for images
      });
    }
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Cloudinary upload error');
  }
};

// export const cloudinaryUploadcategory = async (fileBase64, folder) => {
//   try {
//     const result = await cloudinary.uploader.upload(`data:image/png;base64,${fileBase64}`, {
//       folder: folder,
//       resource_type: 'image',
//     });
//     return result;
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error('Cloudinary upload error');
//   }
// };



export const cloudinaryUploadcategory = async (fileBase64, folder) => {
  try {
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${fileBase64}`, {
      folder: folder,
      resource_type: "image",
    });
    console.log("Cloudinary Upload Successful:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Cloudinary upload error");
  }
};


// product  
// export const cloudinaryUploadprocut = async (fileBase64, folder) => {
//   try {
//     const res = await cloudinary.v2.uploader.upload(`data:image/png;base64,${fileBase64}`, {
//       folder: folder,
//     });
//     return res;
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw error;
//   }
// };




export const cloudinaryUploadprocut = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert Buffer to Readable Stream
    const readableStream = new Readable();
    readableStream._read = () => {}; // No-op _read implementation
    readableStream.push(fileBuffer);
    readableStream.push(null);

    // Pipe the buffer to Cloudinary
    readableStream.pipe(uploadStream);
  });
};



export const cloudinaryUploadThamesatting = async (fileBase64, folder) => {
  try {
    // Remove any data URL prefix if it exists to avoid duplication
    const base64Data = fileBase64.replace(/^data:image\/\w+;base64,/, "");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
      folder: folder,
      resource_type: 'image',
    });

    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Cloudinary upload error');
  }
};




// del 

  export const cloudinaryuserprofile = async (fileBase64, folder) => {
    try {
      // Log the type and content of fileBase64 for debugging
      console.log('Type of fileBase64:', typeof fileBase64);
      console.log('fileBase64 content (first 100 bytes):', fileBase64.slice(0, 100));
  
      // Check if fileBase64 is a Buffer and convert it to a Base64 string
      let base64Data;
      if (Buffer.isBuffer(fileBase64)) {
        base64Data = fileBase64.toString('base64');
      } else if (typeof fileBase64 === 'string') {
        // Remove the base64 prefix if it exists
        base64Data = fileBase64.startsWith('data:image/png;base64,')
          ? fileBase64.replace(/^data:image\/png;base64,/, '')
          : fileBase64;
      } else {
        throw new TypeError('fileBase64 must be a string or Buffer');
      }
  
      const buffer = Buffer.from(base64Data, 'base64');
  
      // Upload the image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error('Cloudinary upload error'));
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
  
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Cloudinary upload error');
    }
  };
  