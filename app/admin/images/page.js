



// clodinery images  post and get ok 





"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import styles from '../../../styles/admin/blog/BlogEditor.module.css';
import Link from 'next/link';
import { cloudinaryUploadProduct } from '../../../lib/frontendcloudinary'; // Cloudinary helper function
import Image from "next/image";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BlogEditor = () => {

    const [images, setImages] = useState([]); // For storing image URLs
    const [loading, setLoading] = useState(false);
    const [allImages, setAllImages] = useState([]); // For storing all uploaded images
    const [showModal, setShowModal] = useState(false); // Modal state
  
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if the user is an admin
        const token = localStorage.getItem('token');
        if (!token) {
        //   router.push('/login');
          return;
        }
        axios.get('/api/admin/blog/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          console.log("User data:", data); // Log the user data  
            setIsAdmin(true);
            setUserId(data.userId); 
        })
        .catch((error) => {
          console.error('Error verifying admin:', error);
          toast.error('Failed to verify admin');
        //   router.push('/login');
        });
      }, [router]);

    const handleImageUpload = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
    
        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            try {
              const uploadResult = await cloudinaryUploadProduct(file);
              const imageUrl = uploadResult.secure_url;
              setImages((prevImages) => [...prevImages, imageUrl]);
              toast.success('Image uploaded successfully');
            } catch (error) {
              toast.error('Error uploading image');
            }
          }
        };
      };

      // Fetch all images from Cloudinary (you may want to implement pagination)
  const fetchAllImages = async () => {
    try {
      const { data } = await axios.get('/api/admin/blog/images'); // Your API endpoint to get all images
      setAllImages(data.images);
    } catch (error) {
      toast.error('Error fetching images');
    }
  };

    const handleOpenModal = async () => {
        await fetchAllImages();
        setShowModal(true);
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
      };


      if (!isAdmin) return null; 
      
    return (
<>
        <button onClick={handleImageUpload} className={styles.button}>
        Upload Image
      </button>

      <button onClick={handleOpenModal} className={styles.button}>
        Choose Image from Gallery
      </button>

            {/* Modal for showing all images */}
                {showModal && (
                    <div className={styles.modal}>
                      <div className={styles.modalContent}>
                        <button onClick={handleCloseModal} className={styles.closeModal}>
                          &times;
                        </button>
                        <h3>Select an Image</h3>
                        <div className={styles.imageGrid}>
                          {allImages.map((image) => (
                              <Image
                              key={image.public_id}
                              src={image.secure_url}
                              alt="Image"
                              onClick={() => handleImageClick(image.secure_url)}
                              className={styles.image}
                       width={500}
                       height={500}
                     />
                 
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
</>
);

};

export default BlogEditor;