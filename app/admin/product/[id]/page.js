"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../../../styles/admin/product/productdetails.module.css';
import Image from 'next/image';
import Link from 'next/link';


import { FaTimes,   FaTrash, FaUndo } from 'react-icons/fa';
import Navbar from '../../../../components/Nav';
// import Navbar from '../../components/Sidebar';
import Loader from "../../../../components/Loader";

const ProductPage = ({ params }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    tags: [],
    sizes: [],
    colors: [],
    media: [],
    attributes: [],
  });
  const [newImages, setNewImages] = useState([]);
const [mediaToRemove, setMediaToRemove] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  const [selectedImage, setSelectedImage] = useState(''); 
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try { 
       
        const response = await axios.get(`/api/admin/product/create/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.media[0]);


      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product.');
        toast.error('Failed to fetch product.');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);


  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesResponse = await axios.get("/api/admin/product/category", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categoriesResponse.data.categories);
        // Set the first category as the default if none is selected
        if (!product.category && categoriesResponse.data.categories.length > 0) {
          setProduct((prevProduct) => ({
            ...prevProduct,
            category: categoriesResponse.data.categories[0].name,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleRemoveAttribute = (title) => {
    setProduct((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.title !== title).map(({ title, values }) => ({ title, values })), // Remove `_id`
    }));
  };
  
  const handleAddValue = () => {
    if (!newTitle || !newValue) return;
  
    setProduct((prev) => {
      const existingAttributeIndex = prev.attributes.findIndex(attr => attr.title === newTitle);
      let updatedAttributes = [...prev.attributes];
  
      if (existingAttributeIndex !== -1) {
        // Prevent duplicate values
        if (!updatedAttributes[existingAttributeIndex].values.includes(newValue)) {
          updatedAttributes[existingAttributeIndex].values.push(newValue);
        }
      } else {
        updatedAttributes.push({ title: newTitle, values: [newValue] });
      }
  
      return { ...prev, attributes: updatedAttributes };
    });
  
    setNewValue("");
  };

  

  const handleRemoveValue = (title, value) => {
    setProduct((prev) => {
      const updatedAttributes = prev.attributes.map((attr) => {
        if (attr.title === title) {
          return { ...attr, values: attr.values.filter((v) => v !== value) };
        }
        return attr;
      });
      return { ...prev, attributes: updatedAttributes };
    });
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
const handleTagsChange = (e) => {
    setProduct({ ...product, tags: e.target.value.split(',').map(tag => tag.trim()) });
  };

  const handleSizesChange = (e) => {
    setProduct({ ...product, sizes: e.target.value.split(',').map(size => size.trim()) });
  };

  const handleColorsChange = (e) => {
    setProduct({ ...product, colors: e.target.value.split(',').map(color => color.trim()) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
  
    setNewImages([...newImages, ...files]); // Store actual files for uploading
    setProduct({ ...product, media: [...product.media, ...filePreviews] }); // Add previews to media array
  };

const handleRemoveMedia = (url) => {
  setMediaToRemove((prev) => {
    if (prev.includes(url)) {
      return prev.filter((item) => item !== url);
    } else {
      return [...prev, url];
    }
  });
};

const handleUpdateProduct = async () => {
  const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('stock', product.stock);
      formData.append('category', product.category);
      formData.append('tags', product.tags.join(','));
      formData.append('sizes', product.sizes.join(','));
      formData.append('colors', product.colors.join(','));
      formData.append('displayOptions', product.displayOptions);

// Append attributes correctly
product.attributes.forEach((attr, index) => {
  formData.append(`attributes[${index}][title]`, attr.title);
  attr.values.forEach((value) => {
    formData.append(`attributes[${index}][values]`, value);
  });
});




           // Append media to remove
      mediaToRemove.forEach((url) => {
        formData.append('mediaToRemove', url);
      });

      // Append new images
      newImages.forEach((image) => {
        formData.append('media', image);
      });

      const response = await axios.put(`/api/admin/product/create/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setProduct(response.data.product);
      toast.success('Product updated successfully!');
      router.push('/admin/dashboard'); 
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product.');
      toast.error('Failed to update product.');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    setLoading(true);

    try {
      await axios.delete(`/api/admin/product/create/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Product deleted successfully!');
      router.push('/admin/dashboard');  // Redirect to product list
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product.');
      toast.error('Failed to delete product.');
    }
    setLoading(false);
  };
 
  return (
    <div className={styles.container}>
 {loading && <Loader />}
<Navbar />
      <h1>Product Details</h1>
      {error && <p className={styles.error}>{error}</p>}
      {product ? (
        <div className={styles.inputcontainer}>
        <div>
          <div className={styles.formGroup}>
            <label>Product Name:</label>
            <input 
              type="text" 
              name="name" 
              value={product.name} 
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea 
              name="description" 
              value={product.description} 
              onChange={handleInputChange}
            />
          </div>
          <div  className={styles.formGroupContainer}>
          <div className={styles.formGroup}>
            <label>Price:</label>
            <input 
              type="number" 
              name="price" 
              value={product.price} 
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Stock:</label>
            <input 
              type="number" 
              name="stock" 
              value={product.stock} 
              onChange={handleInputChange}
            />
          </div>

          </div>

          <div  className={styles.formGroupContainer}>
          <div className={styles.formGroup}>
          <label>Category:</label>
        

<select
       className={styles.selectCat}
        name="category"
        value={product.category} // Bind to the product state
        onChange={handleInputChange}
        disabled={loading || categories.length === 0} // Disable while loading
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>

      <div className={styles.formGroup}>
      <label> Display Options:</label>
      <select
       className={styles.selectCat}
  name="displayOptions"
  value={product.displayOptions}
  onChange={(e) =>
    setProduct({ ...product, displayOptions: e.target.value })
  }
>
  <option value="recommended">Recommended</option>
  <option value="allproducts">All Products</option>
  <option value="latest">Latest</option>
  <option value="future">Future</option>
  <option value="toprating">Top Rating</option>
</select>
</div>




          </div>

          <div className={styles.formGroup}>
            <label>Tags (comma separated):</label>
            <input 
              type="text" 
              name="tags" 
              value={product.tags.join(', ')} 
              onChange={handleTagsChange}
            />
          </div>

          </div>

          <div  className={styles.formGroupContainer}>
          <div className={styles.formGroup}>
            <label>Sizes (comma separated):</label>
            <input 
              type="text" 
              name="sizes" 
              value={product.sizes.join(', ')} 
              onChange={handleSizesChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Colors (comma separated):</label>
            <input 
              type="text" 
              name="colors" 
              value={product.colors.join(', ')} 
              onChange={handleColorsChange}
            />
          </div>

          {/* Attributes Input */}
      <div className={styles.attributeInput}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter Attribute Title"
          className={styles.input}
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Enter Attribute Value"
          className={styles.input}
        />
        <button onClick={handleAddValue} className={styles.addButton}>Add Value</button>
      </div>

      {/* Display Added Attributes */}
      {product.attributes.map((attr, index) => (
        <div key={index} className={styles.attributeContainer}>
          <strong>{attr.title}</strong>
          <div className={styles.values}>
            {attr.values.map((value, i) => (
              <span key={i} className={styles.value}>
                {value}
                <FaTrash className={styles.removeIcon} onClick={() => handleRemoveValue(attr.title, value)} />
              </span>
            ))}
          </div>
          <FaTrash className={styles.removeIcon} onClick={() => handleRemoveAttribute(attr.title)} />
        </div>
      ))}


          </div>

         
        </div>



      <div className={styles.mainImageContainer}>
            <Image
              src={selectedImage || product.media[0]} // Display selected image or default to first image
              alt={`${product.name} - main image`}
              className={styles.mainImage}
              width={600}
              height={600}
              priority
            />

          {/* Image Gallery */}
          <div className={styles.imageGallery}>
            {product.media.map((imageUrl, index) => (
              <div key={index} className={styles.imageContainer}>
                <Image
                  src={imageUrl}
                  alt={`${product.name} - image ${index + 1}`}
                  className={styles.previewImage}
                  width={100}
                  height={100}
                  priority
                  onClick={() => setSelectedImage(imageUrl)} // On click, update main image
                />
                <div
                  className={styles.removeButton}
                  onClick={() => handleRemoveMedia(imageUrl)}
                >
                  {mediaToRemove.includes(imageUrl) ? (
                    <>
                      <FaUndo />
                    </>
                  ) : (
                    <>
                      <FaTimes /> 
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.imageuploader}>
          <label>Upload New Images:</label>
          <input 
            type="file" 
            multiple 
            onChange={handleImageUpload}
          />
        </div>        

          </div>



          <div className={styles.actionbutton}>
       <button onClick={handleUpdateProduct}>Update Product</button>
       <button onClick={handleDeleteProduct}>Delete Product</button>
       </div>
       
        </div>

     
      ) : (
        <p>Loading product details...</p>
      )}


{isLoading && <div className="loader"><Loader /></div>}

    </div>
  );
};
 
export default ProductPage;



