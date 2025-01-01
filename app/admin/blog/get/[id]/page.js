



'use client';

import {  useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname  } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../../../../styles/admin/blog/BlogDetails.module.css'; // Assuming you have a CSS module for this page
import Link from 'next/link';
import Navbar from '../../../../../components/Nav';
import Loader from '../../../../../components/Loader';


 

const BlogDetailsadmin = ({params}) => {
    const router = useRouter();
    const { id } = params; // Extract the blog ID from the URL
  const [blog, setBlog] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Unauthorized: Please log in.');
          return;
        }

        const { data } = await axios.get(`/api/admin/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlog(data.blog);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Error fetching blog details');
        toast.error('Error fetching blog details');
      }
      finally {
        setLoading(false);
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
    <>
    <Navbar />
    
    <div className={styles.container}>
    {loading && <Loader />}

<div> 

<p><strong>Author:</strong> {blog.author?.name || 'Unknown'}</p>
<p><strong>Published:</strong> {blog.published ? 'Yes' : 'No'}</p>
<p><strong>Created At:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
<p><strong>Last Updated:</strong> {new Date(blog.updatedAt).toLocaleDateString()}</p>

</div>
  <h2>{blog.title}</h2>
  <h3>{blog.heading}</h3>
  <p><strong>Content:</strong></p>
  <div dangerouslySetInnerHTML={{ __html: blog.content }} />

  <Link onClick={() =>
   handleLinkClick("/admin/dashboard")} 
   href="/admin/dashboard"> 
   Go to blog </Link>
</div>

{isLoading && <div className="loader"><Loader /></div>}
    </>
   
  );
};

export default BlogDetailsadmin;

