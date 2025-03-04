



"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";
import styles from "../../styles/admin/categories/Categories.module.css";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FaStar, FaTrash,
   FaArrowLeft, FaTimes,
    FaArrowRight
    } from 'react-icons/fa';

import ReactPaginate from 'react-paginate';

const Categories = ( { params }) => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get("/api/admin/product/category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories. Please check your credentials.");
        toast.error("Failed to fetch categories. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCategoryImage(file);
        setCategoryImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    if (!categoryImage) {
      toast.error("Please upload an image.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new URLSearchParams();
      formData.append("name", newCategory);

      const reader = new FileReader();
      reader.readAsDataURL(categoryImage);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        formData.append("categoryImage", base64Image);

        try {
          const response = await axios.post("/api/admin/product/category", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });

          setCategories([...categories, response.data.category]);
          setNewCategory("");
          setCategoryImage(null);
          setCategoryImagePreview("");
          toast.success("Category created successfully!");
          setShowModal(false); // Close the modal
        } catch (error) {
          handleError(error, "Failed to create category.");
        }
      };
      reader.onerror = () => {
        handleError(new Error("Failed to convert image."), "Failed to convert image.");
      };
    } catch (error) {
      handleError(error, "Failed to convert image.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = useCallback(
    (error, defaultMessage) => {
      const errorMessage = error.response?.data?.message || error.message || defaultMessage;

      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        router.push("/login");
      } else {
        toast.error(errorMessage);
      }

      console.error(errorMessage);
    },
    [router]
  );
  const navigateToHome = () => {
    router.push('/admin/dashboard'); // Navigates to the home page
  };

  const handleDelete = async (categoryId) => {
   
    // if (!toast.error("Are you sure you want to delete this category?")); {
    //   return;
    // }
    // if (!window.confirm("Are you sure you want to delete this category?")) {
    //   return;
    // }
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No token found");
      }
  
      
      await axios.delete(`/api/admin/product/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Remove the deleted category from the categories list
      setCategories(categories.filter((category) => category._id !== categoryId));
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className={styles.container}>
     

      
     <div className={styles.ShippingInformation}> 
     <button onClick={navigateToHome} className={styles.arrowButton} >  <FaArrowLeft /></button>
     <div className={styles.ShippingInformationh1}>
         <h1>Manage Categories</h1>
        
       </div>

       <button className={styles.button} onClick={() => setShowModal(true)}>
       Create Category
     </button>
     </div>

  


      {loading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.categoryGrid}> 
        {categories.map((category) => (
          <div key={category._id} className={styles.categoryCard}>
            
              <div className={styles.categoryCardImag}> 
                <Image
                  src={category.categoryImage}
                  alt={category.name}
                  className={styles.previewImage}
                  width={400}
                  height={400}
                  priority
                />
                
               </div>
            <div className={styles.categoryCardButton}>
            <h3 className={styles.categoryName} >{category.name}</h3>
            <button onClick={() => handleDelete(category._id)} disabled={loading}>
                <FaTrash />
              </button>   
                </div>
          </div>
        ))}
      </div>

      {showModal && (
        <>
          <div className={styles.overlay} onClick={() => setShowModal(false)} />
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
            <FaTimes />
            </button>
            <h2>Create New Category</h2>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} placeholder="Upload Category Image" />
            {categoryImagePreview && (
              <div>
                  <Image
                 src={categoryImagePreview}
                 alt="Category Preview"
                 className={styles.previewImage}
        width={500}
        height={500}
      />

              
              </div>
            )}
            <button onClick={handleCreateCategory} className={styles.button} disabled={loading}>
              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </>
      )}


      
    </div>
  );
};

export default Categories;
