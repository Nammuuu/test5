
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../../styles/blog/BlogList.module.css'; 
import Link from 'next/link';
import Loader from '../../../components/Loader';
import { useRouter, usePathname  } from 'next/navigation';
import Image from 'next/image';




const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
 
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const { data } = await axios.get('/api/user/userblog');
        setBlogs(data.blogs);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Error fetching blogs');
      }
      finally {
        setLoading(false); // Set loading to false after API call, regardless of success or failure
      }
    };

    fetchBlogs();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const extractImages = (html) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const images = [];
    let match;

    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]); // Extract the src attribute
    }

    return images;
  };

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
      <h2>Recent Blogs</h2>
     
      <div className={styles.blogGrid}>
        {blogs.map((blog) => {
          // Extract images from the blog content
          const imagesFromContent = extractImages(blog.content);

          return (
            <div key={blog._id} className={styles.blogCard}>
              {/* Link to the blog details page */}
              <Link  href={`/blog/${blog._id}`} onClick={() => handleLinkClick(`/blog/${blog._id}`)}>
                {/* Display the first image found in the content if available */}
                {imagesFromContent.length > 0 ? (
                <Image
                src={imagesFromContent[0]}
                    alt={blog.title}
                    className={styles.blogImage}
                width={200}
                height={200}
              />
                
                ) : (

                  <Image
                  src="/path/to/default/image.jpg" // Fallback default image
                  alt="Default Image"
                  className={styles.blogImage}
                  width={200}
                  height={200}
                />

                
                )}
                



                {/* Display the blog's first image if available */}
                {blog.images.length > 0 && (
                 

                  <Image
                  src={blog.images[0]} // Display the first image from the blog's image array
                    alt={blog.title}
                    className={styles.blogImage}
                  width={200}
                  height={200}
                />

                )}

                <div className={styles.blogContent}>
                 
                  <h3>{blog.title.length > 50 ? blog.title.slice(0, 50) + '...' : blog.title}</h3>
                  <p className={styles.description}>
                    {stripHtml(blog.content).substring(0, 100)}... {/* Trimmed description */}
                  </p>
                </div>

                

              </Link>
            </div>
          );
        })}
      </div>

      {isLoading && <div className="loader"><Loader /> </div>}
    </div>
  );
};

export default BlogList;
