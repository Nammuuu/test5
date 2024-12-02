

// lib/frontendcloudinary.js


export const cloudinaryUploadProduct = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dhov4im8'); // Cloudinary preset name
    formData.append('folder', 'blog_images'); // Folder to store images in Cloudinary
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dp7anotjs/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  };
  