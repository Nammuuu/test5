

"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from '../../../../styles/admin/blog/BlogList.module.css'; // Import CSS module
import Link from 'next/link';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Unauthorized: Please log in.');
          return;
        }

        const { data } = await axios.get('/api/admin/blog', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlogs(data.blogs);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError('Error fetching blogs');
        toast.error('Error fetching blogs');
      }
    };

    fetchBlogs();
  }, []);

  // Update blog published status
  const updatePublishedStatus = async (id, published) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/blog/${id}`,
        { published },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Blog ${published ? 'Published' : 'Set to Private'}`);
      setBlogs(blogs.map(blog => blog._id === id ? { ...blog, published } : blog));
    } catch (error) {
      toast.error('Error updating blog status');
    }
  };

  // Delete blog by ID
  const deleteBlog = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Blog deleted successfully');
      setBlogs(blogs.filter(blog => blog._id !== id)); // Remove blog from state
    } catch (error) {
      toast.error('Error deleting blog');
    }
  };

  return (
    <div className={styles.container}>
      <h2>All Blogs</h2>
      {loading ? (
        <p>Loading blogs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className={styles.blogTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Heading</th>

             
              <th>Actions</th>
              <th>Created At</th>
              <th>View details</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
            <td>{blog.title.length > 25 ? blog.title.slice(0, 25) + "..." : blog.title}</td>
            <td>{blog.heading.length > 25 ? blog.heading.slice(0, 25) + "..." : blog.heading}</td>
              
                
                
                <td>
                  {/* Toggle Publish/Private Status */}
                

                 
                 
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/blog/get/${blog._id}`}>View details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        
    </div>
  );
};

export default BlogList;



                  // <button
                  //   onClick={() => updatePublishedStatus(blog._id, true)}
                  //   disabled={blog.published}
                  //   className={styles.publishButton}
                  // >
                  //   Publish
                  // </button>

                  // <button
                  //   onClick={() => updatePublishedStatus(blog._id, false)}
                  //   disabled={!blog.published}
                  //   className={styles.privateButton}
                  // >
                  //   Set to Private
                  // </button>