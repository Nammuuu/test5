'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '../../../../styles/blog/BlogDetails.module.css'; 
import Image from 'next/image'; 
import Link from 'next/link';
import Loader from "../../../../components/Loader";
import { useRouter, usePathname  } from 'next/navigation';

const BlogDetails = ({ params }) => {
    const { id } = params;  // URL slug of the blog
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
   
      themeColor: "#ffffff", 
      shopName: "",
      website: "",
      font: "Poppins", 
    });

    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false); // State to track loading
    const [prevPathname, setPrevPathname] = useState(pathname);

    
    useEffect(() => {
      const fetchSettings = async () => {
        try {
          const res = await axios.get("/api/admin/setting");
          if (res?.data) {
            setFormData(res.data);  // Ensure you update the formData with the correct settings
          
           
          }
        } catch (error) {
          console.error("Failed to load settings:", error);
        }
      };
    
      fetchSettings();
    }, []);



    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/user/userblog/${id}`);
                setBlog(data.blog);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError('Error fetching blog details');
            }
        };

        fetchBlog();
    }, [id]);



    // Handler for link clicks
const handleLinkClick = (link) => {
  if (link === pathname) {
    console.log("Same page click, no loader.");
    return; // Don't trigger loading for the same page
  }
  
  console.log(`Navigating to ${link}`);
  setIsLoading(true);
  router.push(link); // Change route using Next.js router
};


// Effect to track pathname changes for loading state
useEffect(() => {
  // Whenever the pathname changes, we set loading to true
  const handlePathChange = () => {
    setIsLoading(true);
  };

  // Set loading to false after navigating
  const handlePathChangeComplete = () => {
    console.log("Route change completed");
    setIsLoading(false);
  };

  // Listen to pathname changes
  handlePathChange();

  // You can use a small timeout to simulate the completion of loading
  const timeout = setTimeout(() => {
    handlePathChangeComplete();
  }, 500); // Adjust the timeout based on your loading needs

  // Clean up timeout on component unmount
  return () => {
    clearTimeout(timeout);
  };
}, [pathname]); // Run effect on pathname change



    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.container}>
{loading && <Loader />}
        <div className={styles.metadata}>
        <p><strong className={styles.author}>Author:</strong>{formData?.shopName}</p>
        <p><strong>Published on:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
      </div>
      
          <h1 className={styles.title}>{blog.title}</h1>
          <h2 className={styles.heading}>{blog.heading}</h2>
      
          <div className={styles.imageContainer}>
            {blog.images.map((image, index) => (
              <Image 
                key={index} 
                src={image} 
                alt={`Blog Image ${index + 1}`} 
                width={600} 
                height={400}
                className={styles.blogImage}
              />
            ))}
          </div>
      
         
      
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: blog.content }} />
      
          <div className={styles.tags}>
            {/* Display dynamic tags */}
            {blog.tags && blog.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
      
          <div className={styles.socialSharing}>

          <button
        className={styles.socialButton}
        onClick={() => {
            const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`;
            window.open(shareUrl, '_blank');
        }}
    >
        Share on Twitter
    </button>
    <button
        className={styles.socialButton}
        onClick={() => {
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
            window.open(shareUrl, '_blank');
        }}
    >
        Share on Facebook
    </button>



            <button className={styles.socialButton}> <Link href="/blog"  onClick={() => handleLinkClick("/blog")}>Back to Blogs</Link> </button>
          </div>

          {isLoading && <div className="loader"><Loader /></div>}
        </div>
      );
      
      
};

export default BlogDetails;
 

{/* <button className={styles.socialButton}>Share on Twitter</button> */}
{/* <button className={styles.socialButton}>Share on Facebook</button> */}