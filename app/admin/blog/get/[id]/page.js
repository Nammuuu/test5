



'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../../../../styles/admin/blog/BlogDetails.module.css'; // Assuming you have a CSS module for this page
import Link from 'next/link';
 

const BlogDetailsadmin = ({params}) => {
    const router = useRouter();
    const { id } = params; // Extract the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

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
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading blog details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>

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

      <Link href="/admin/dashboard"> Go to blog </Link>
    </div>
  );
};

export default BlogDetailsadmin;

