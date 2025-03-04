
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';



export default function CategoryPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get('/api/auth/login/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      console.log("User data:", data); // Log the user data
      if (data.user.role !== 'admin') {
        toast.error('Unauthorized access');
        router.push('/login');
      } else {
        setIsAdmin(true);
      }
    })
    .catch((error) => {
      console.error('Error verifying admin:', error);
      toast.error('Failed to verify admin');
      router.push('/login');
    });
  }, [router]);

  const handleDelete = async () => {
    const { id } = params;

    if (!id) {
      toast.error('No category ID provided');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/api/admin/product/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Category deleted successfully');
      router.push('/admin/dashboard'); // Redirect to categories list
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) return null; // Render nothing if the user is not an admin

  return (
    <div>
      <h1>Delete Category</h1>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Category'}
      </button>
    </div>
  );
}

