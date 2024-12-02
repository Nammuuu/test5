





'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from '../../../styles/product/SearchBar2.module.css';
import Link from 'next/link';
import Loader from "../../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaSearch,
   FaBars, FaTimes, 
  FaTag, FaFilter, FaSortAmountUp,
   FaSortAmountDown,
    FaHeart,
    FaTrash,
  FaEye,
  FaShoppingCart,
 } from 'react-icons/fa';
import Image from "next/image";
import CartSidebar from "../../../components/Home/CartSidebar";
import WishlistSidebar from "../../../components/Home/WishlistSidebar";

import { useRouter } from "next/navigation";

const ProductDetails = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [sortByLatest, setSortByLatest] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [initialProducts, setInitialProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState(initialProducts || []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  
  const [products, setProducts] = useState([]);
 
 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
 
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const router = useRouter();

  // product creating start 

  
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    seles: '',
    price: 1,
    stock: 1,
    category: '',
    tags: [],
    media: [],
    title: '',
    sizes: [],
    colors: [],
    displayOptions: ['recommended'],
    discountPrice: '', // Add discountPrice
    materials: [],     // Add materials
    coupons: [],   
    categoryId: '',  // Store categoryId separately
    categoryName: '',  // Store categoryName separately
      

  });
  const [categoryImage, setCategoryImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // For image preview
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state


  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/product/search');
        setInitialProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial products:', error);
        setLoading(false);
      }
    };
    fetchInitialProducts();
  }, []);

  // Fetch products based on search query, sorting, price range, and category
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/api/user/product/search', {
          params: {
            query,
            sort: sortByLatest ? 'latest' : sortByPrice ? 'price' : '',
            minPrice,
            maxPrice,
            category: selectedCategory,
          },
        });
        setSuggestions(response.data.products);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (query || sortByLatest || sortByPrice || selectedCategory) {
      fetchSuggestions();
    }
  }, [query, sortByLatest, sortByPrice, minPrice, maxPrice, selectedCategory]);

  // Fetch popular tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/user/product/search/tag');
        setTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/user/category/cate');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const toggleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  // const handleSearchChange = (e) => {
  //   setQuery(e.target.value);
  // };

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Filter suggestions based on the new query
    const filteredSuggestions = allProducts.filter((product) =>
      product.name.toLowerCase().includes(newQuery.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
  };



  const handleTagClick = (tag) => {
    setQuery(tag);
    setSelectedCategory(null); 
    setSelectedRating(null); 
    
  };

  const handleSearchSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/user/product/search', {
        params: {
          query,
          sort: sortByLatest ? 'latest' : sortByPrice ? 'price' : undefined,
          minPrice,
          maxPrice,
        },
      });
      setSuggestions(response.data.products);
      if (!response.data.products.length) {
        alert(`No products found for "${query}"`);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleCategoryClick = (category) => {
    setQuery('');
    setSelectedRating(null);
    
    setSelectedCategory(category.name);
     // Clear search query when selecting a category
     // Clear selected rating

    const filtered = initialProducts.filter((product) => product.category === category.name);
    setFilteredProducts(filtered);

    console.log('Searching for:', query);
  };

  const handlePriceRangeChange = (e) => {
    const [min, max] = e.target.value.split(',').map(Number);
    setMinPrice(min || 0);
    setMaxPrice(max || 100000);
  };


  const handleMinRangeChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= maxPrice) {
      setMinPrice(newMin);
    }
  };

  const handleMaxRangeChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax >= minPrice) {
      setMaxPrice(newMax);
    }
  };




  const trimText = (text, length) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const filterProducts = useCallback(async  () => {
    let filtered = initialProducts;

    if (selectedRating) {
      filtered = filtered.filter(
        (product) => Math.round(product.averageRating) === selectedRating
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (minPrice || maxPrice < 100000) {
      filtered = filtered.filter((product) => product.price >= minPrice && product.price <= maxPrice);
    }

    setFilteredProducts(filtered);
  }, [selectedRating, initialProducts, selectedCategory, minPrice, maxPrice, ] );



  useEffect(() => {
    filterProducts();
  }, [filterProducts, selectedRating, selectedCategory, minPrice, maxPrice, query]);


  const handleRatingClick = (rating) => {
    // If the same rating is clicked again, deselect it
    if (selectedRating === rating) {
      setSelectedRating(null); // Deselect
      setSelectedCategory(null); 
     
      setFilteredProducts(initialProducts); // Reset to show all products
    } else {
      setSelectedRating(rating);
      setQuery(''); 
      setSelectedCategory(null); 
      
      

      const filtered = initialProducts.filter(
        (product) => Math.round(product.averageRating) === rating // Adjust the comparison if necessary
      );
      setFilteredProducts(filtered);
    }
  };


  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };


  // new style product fix 

   
 
  const addToCart = (product) => {
    const newItem = {
      ...product,
      quantity: 1,
      selectedSize,
      selectedColor,
      selectedMaterial,
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      // Increase quantity if the item already exists in the cart
      existingItem.quantity += 1;
      cart = cart.map((item) =>
        item._id === product._id ? existingItem : item
      );
      toast.success(
        <div>

<Image
              src={product.media[0]}
              alt={product.name}
              style={{ objectFit: "cover" }}
        width={50}
        height={50}
      />

        
          <div>{product.name}</div>
          <div>Quantity: {existingItem.quantity}</div>
        </div>,
        { autoClose: 3000 }
      );
    } else {
      // Add new item with quantity 1
      cart.push(newItem);
      toast.success(
        <div>

<Image
                src={product.media[0]}
                alt={product.name}
                style={{ objectFit: "cover" }}
        width={500}
        height={500}
      />

         
          <div>{product.name}</div>
          <div>Quantity: 1</div>
        </div>,
        { autoClose: 3000 }
      );
    }
  localStorage.setItem('cart', JSON.stringify(cart));
  setCartUpdated(prev => !prev); // Trigger re-render
  setIsCartOpen(true); // Open the cart sidebar to reflect the change
};


  const handleAddToCart = (product) => {
    if (product.sizes.length > 0 && !selectedSize) {
      openQuickView(product); // Trigger modal for option selection
      toast.error("Please select a size.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      openQuickView(product);
      toast.error("Please select a color.");
      return;
    }
    if (product.materials && product.materials.length > 0 && !selectedMaterial) {
      openQuickView(product);
      toast.error("Please select a material.");
      return;
    }

   
    addToCart(product);


  };



  const handleAddToWishlist = (product) => {
    if (product.sizes.length > 0 && !selectedSize) {
      openQuickView(product); // Trigger modal for option selection
      toast.error("Please select a size.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      openQuickView(product);
      toast.error("Please select a color.");
      return;
    }
    if (product.materials && product.materials.length > 0 && !selectedMaterial) {
      openQuickView(product);
      toast.error("Please select a material.");
      return;
    }
  
    addToWishlist(product); // If all selections are made, proceed to add to wishlist
  };
  
  const addToWishlist = (product) => {
    const newItem = {
      ...product,
      selectedSize,
      selectedColor,
      selectedMaterial,
    };
  
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingItem = wishlist.find((item) => item._id === product._id);
    
    if (!existingItem) {
      wishlist.push(newItem);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success(`${product.name} added to wishlist`);
      setWishlistUpdated((prev) => !prev); // Trigger re-render
    } else {
      setWishlistUpdated(prev => !prev);
      toast.info(`${product.name} is already in your wishlist`);
    }
    setWishlistUpdated(prev => !prev);
    setIsWishlistOpen(true);
  };

  

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 !== 0;
    const stars = Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} color={i < fullStars ? "#ffc107" : "#e4e5e9"} />
    ));
    if (halfStars)
      stars.push(
        <FaStar
          key="half"
          color="#ffc107"
          style={{ clipPath: "inset(0 50% 0 0)" }}
        />
      );
    return stars;
  };



    const isInCart = (productId) => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      return cart.some(item => item._id === productId);
    };
  
    // Check if the product is already in the wishlist
    const isInWishlist = (productId) => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      return wishlist.some(item => item._id === productId);
    };

    const openQuickView = (product) => {
        setQuickViewProduct(product); // Set the product to view in the Quick View modal
      };
    
      const closeQuickView = () => {
        setQuickViewProduct(null); // Close Quick View modal
    };


// for product creating  

useEffect(() => {
  const fetchProductsAndCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const productsResponse = await axios.get('/api/admin/product/create', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsResponse.data.products);

      const categoriesResponse = await axios.get('/api/admin/product/category', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categoriesResponse.data.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please check your credentials.');
      toast.error('Failed to fetch data. Please check your credentials.');
    }
  };

  fetchProductsAndCategories();
}, []);

const handleCreateProduct = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('seles', newProduct.seles);
    formData.append('price', newProduct.price);
    formData.append('stock', newProduct.stock);
    formData.append('category', newProduct.category);
    
 // Send category ID and category name
 formData.append('categoryId', newProduct.categoryId);  // Send category ID
 formData.append('categoryName', newProduct.categoryName);  // Send category name
 

    formData.append('title', newProduct.title);
    formData.append('tags', JSON.stringify(newProduct.tags));
    formData.append('sizes', JSON.stringify(newProduct.sizes));
    formData.append('colors', JSON.stringify(newProduct.colors));
    formData.append('displayOptions', newProduct.displayOptions);
    formData.append('discountPrice', newProduct.discountPrice);  // Send discountPrice
    formData.append('materials', JSON.stringify(newProduct.materials));  // Send materials
    formData.append('coupons', JSON.stringify(newProduct.coupons)); 

    if (categoryImage) {
      formData.append('categoryImage', categoryImage);
    }

          // Add category image
          // if (categoryImage) {
          //   const reader = new FileReader();
          //   reader.readAsDataURL(categoryImage);
          //   await new Promise((resolve) => {
          //     reader.onload = () => {
          //       formData.append('categoryImage', reader.result.split(',')[1]);
          //       resolve();
          //     };
          //   });
          // }


    // productImages.forEach((image, index) => {
    //   formData.append('productImages', image); // Add product images to formData
    // });

          // Add product images
          for (const image of productImages) {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            await new Promise((resolve) => {
              reader.onload = () => {
                formData.append('productImages', reader.result.split(',')[1]);
                resolve();
              };
            });
          }


    const response = await axios.post('/api/admin/product/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    setProducts([...products, response.data.product]);
    setNewProduct({
      name: '',
      description: '',
      seles: '',
      price: 1,
      stock: 1,
      // category: '',
      category: '', 
      tags: [],
      media: [],
      title: '',
      sizes: [],
      colors: [],
      displayOptions: ['recommended'],
      discountPrice: '', // Reset discountPrice
      materials: [],     // Reset materials
      coupons: [],       // Reset coupons
    });
    setCategoryImage(null);
    setProductImages([]);
    setImagePreviews([]);
    toast.success('Product created successfully!');
    setIsModalOpen(false); // Close modal after product is created
  } catch (error) {
    console.error('Error creating product:', error);
    setError('Failed to create product.');
    toast.error('Failed to create product.');
  }
};

const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setProductImages(files);

  const previews = files.map((file) => URL.createObjectURL(file));
  setImagePreviews(previews); // Set image previews
};


const handleAddTag = (tag) => {
  if (tag && !newProduct.tags.includes(tag)) {
    setNewProduct((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  }
};

const handleRemoveTag = (tagToRemove) => {
  setNewProduct((prev) => ({
    ...prev,
    tags: prev.tags.filter((tag) => tag !== tagToRemove),
  }));
};


const handleCategoryChange = (e) => {
  setNewProduct((prev) => ({
    ...prev,
    category: e.target.value,
  }));
};

const getFiveDaysAgo = () => {
  const today = new Date();
  const fiveDaysAgo = new Date(today.setDate(today.getDate() + 5));
  return fiveDaysAgo.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// product creating end  


  const ProductCard = ({ product }) => (
    <div className={styles.productItem}>
      <div className={styles.product_iconsto}> 
        <FaEye onClick={() => openQuickView(product)} />
      </div>
      <Link  href={`/admin/product/${product._id}`}>
      <div className={styles.mainproduct_images}>
      <Image
        className={styles.product_list_images}
        src={product.media[0] || ""}
        alt={product.name}
        width={100}
        height={100}
      />
    </div>

      </Link>
      <div className={styles.product_list_containet}>
        <h4>{product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}</h4>
        
        <p className={styles.conmmanClassname}>{renderRating(product.averageRating)}</p>


        <div className={styles.price_containet}>
          <p className={styles.price}>₹{product.price}</p>
          <p className={styles.discountPrice}>₹{product.discountPrice}</p>
        </div>
        <p>Sales: {product.salesCount} | Views: {product.viewsCount}</p>
        

      </div>
    </div>
  );

  const QuickViewModal = ({
    product,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    selectedMaterial,
    setSelectedMaterial,
    handleAddToWishlist,
    handleAddToCart,
    closeQuickView,
  }) => (
    <div className={styles.quick_view_modal}>
      <div className={styles.quick_view_content}>
        <div className={styles.QuickView_images_ccontainer}>
        <Image
        className={styles.quickViewProduct_images}
        src={quickViewProduct.media[0] || "/default-image.png"}
         alt={quickViewProduct.name}
        width={300}
        height={300}
      />

        </div>

        <div className={styles.quickViewProduct_container}>
          <button className={styles.close_btn} onClick={closeQuickView}>
            <FaTimes />
          </button>

          <h2 className={styles.product_name} >{product.name}</h2>
          <p className={styles.product_des} >{product.description.slice(0, 200)}...</p>
          <p className={styles.product_name} >{product.seles} </p>
          <div className={styles.price_containet}>
            <p className={styles.price_quick}>₹{product.price}</p>
            <p className={styles.discountPrice}>₹{product.discountPrice}</p>
          </div>
  
          {/* Options: Sizes, Colors, Materials */}
          <ProductOptions
            options={product.sizes}
            label="Size"
            selectedOption={selectedSize}
            setSelectedOption={setSelectedSize}
          />
          <ProductOptions
            options={product.colors}
            label="Color"
            selectedOption={selectedColor}
            setSelectedOption={setSelectedColor}
          />
          <ProductOptions
            options={product.materials}
            label="Material"
            selectedOption={selectedMaterial}
            setSelectedOption={setSelectedMaterial}
          />
  
          {/* Add to Wishlist and Cart Buttons */}

          <div className={styles.modal_product_icons}>
          <div className={styles.modal_product_buttons}>
            <button  className={styles.quickViewProduct_product_cart}  onClick={() => handleAddToWishlist(product)}>Add to Wishlist</button>
            <button  className={styles.quickViewProduct_product_cart} onClick={() => handleAddToCart(product)}>Add to Cart</button>
           
          </div>

          <Link  className={styles.quickViewProduct_product_cart_link} href={`/product/details/${product._id}`}>View Details</Link>
</div>

        </div>
      </div>
    </div>
  );
  


  const ProductOptions = ({ options, label, selectedOption, setSelectedOption }) => (
    options && options.length > 0 && (
      <div className={styles.selector_container}>
        <label>{label}:</label>
        <div  className={styles.options}>
          {options.map(option => (
            <button
              key={option}
               className={`${styles.option}  ${selectedOption === option ? styles.selected : ""}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  );

  



  return (
    <div className={styles.searchBarContainer}>
      {loading && <Loader />}
      

    <div className={styles.searchBarContainerto}>
  


          {/* Product Display */}
{/* Product Display */}
<div className={styles.products}>
  {/* Header Section
    <header className={styles.header}>
    <div className={styles.sidebarToggle} onClick={toggleSidebar}>
      {isSidebarOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
    </div>
    <h1 className={styles.logo}>My Store</h1>
  </header>
   */}
  

  {/* Search Input */}
  <div className={styles.searchBar}>
    <input

    
      type="text"
      value={query}
      onChange={handleSearchChange}
      placeholder="Search products..."
      className={styles.searchInput}
      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
    />
    <button className={styles.createButton} onClick={() => setIsModalOpen(true)}>
      Create New Product
    </button>

    <button onClick={handleSearchSubmit}>
      <FaSearch />
    </button>
  </div>

  {/* Product Listing */}
  <h4 className={styles.allheading}>
    {selectedRating ? `Filtered Products with ${selectedRating} Star Rating` : 'Product List'}
  </h4>

  <div className={styles.productsGrid}>
    {selectedRating && filteredProducts.length > 0 ? (
      filteredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))
    ) : query && suggestions.length > 0 ? (
      suggestions.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))

    ) :  suggestions.length > 0 ? (
      suggestions.map((product) => (
        <ProductCard key={product._id} product={product} />
    ))

    ) : !query && initialProducts.length >  0 ? (
      initialProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))
 
    ) : initialProducts.length > 0 ? (
      initialProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))
    ) :
    
    (
      <p>No products found</p>
    )}
  </div>

  {/* Quick View Modal */}
  {quickViewProduct && (
    <QuickViewModal 
      product={quickViewProduct} 
      selectedSize={selectedSize}
      setSelectedSize={setSelectedSize}
      selectedColor={selectedColor}
      setSelectedColor={setSelectedColor}
      selectedMaterial={selectedMaterial}
      setSelectedMaterial={setSelectedMaterial}
      handleAddToWishlist={handleAddToWishlist}
      handleAddToCart={handleAddToCart}
      closeQuickView={closeQuickView}
    />
  )}
</div>



</div>


<div className={styles.container}>
  {isModalOpen && (
    <div className={styles.modalOverlay}>
    
      <div className={styles.modalContent}>

      <h2>Create Product</h2>

        <div className={styles.inputcontainer}>

        <div className={styles.colorSizeMatrialTagcontinaer}>
          <label htmlFor="productname" className={styles.label}>Product name <span> * </span></label>
          <input
            type="text"
            id="productname"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
</div>
           {/*  Price */}
           <div className={styles.colorSizeMatrialTagcontinaer}>

          <label htmlFor="Price" className={styles.label}> Price <span> * </span></label>

          <input
            type="number"
            id="Price"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />

      </div>

        </div>

        <div className={styles.colorSizeMatrialTagcontinaer}>
          <label htmlFor="des" className={styles.label}> Description  <span> * </span></label>
          <textarea
            id="des"
            type="Description"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </div>


        <div className={styles.colorSizeMatrialTagcontinaer}>
        <label htmlFor="seles" className={styles.label}> Seles Tag  <span> * </span></label>
        <textarea
          id="des"
          type="seles"
          placeholder="Seles Tag"
          value={newProduct.seles}
          onChange={(e) => setNewProduct({ ...newProduct, seles: e.target.value })}
        />
      </div>





        
         {/* one time inputs   */}
  <div  className={styles.inputcontainer}>
  
         {/*  discount price */}
        <div className={styles.colorSizeMatrialTagcontinaer}>
          {/*couse material and discousd price add*/}
          <label htmlFor="discount" className={styles.label}>Discount Price <span className={styles.onlyhighprice}> only display high price </span> </label>
          <input
            id="discount"
            type="number"
            placeholder="Discount Price"
            value={newProduct.discountPrice}
            onChange={(e) => setNewProduct({ ...newProduct, discountPrice: parseFloat(e.target.value) })}
          />

        </div>
 {/*  stcok */}
        <div className={styles.colorSizeMatrialTagcontinaer}>
          <label htmlFor="stcok" className={styles.label}>Stcok</label>

          <input
            id="stcok"
            type="number"
            placeholder="Stock"
            value={newProduct.stcok}
            onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          />
        </div>
</div>



       {/*  add tag */}

      <div  className={styles.inputcontainer}> 
        <div className={styles.colorSizeMatrialTagcontinaer}>



          <label htmlFor="tag" className={styles.label}> Add tags <span> * </span></label>
          <input
            type="text"
            id="tag"
            placeholder="Add Tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <div>
            {newProduct.tags.map((tag) => (
              <span key={tag} onClick={() => handleRemoveTag(tag)}>
                {tag} <span> <FaTrash className={styles.removeIcon} /></span>
              </span>
            ))}
          </div>

        </div>

        {/* Add inputs for sizes */}

        <div className={styles.colorSizeMatrialTagcontinaer}>


          <label htmlFor="size" className={styles.label}> Add Size <span> * </span></label>

          <input
            id="size"
            type="text"
            placeholder="Add Size"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                const size = e.target.value.trim();
                if (!newProduct.sizes.includes(size)) {
                  setNewProduct((prev) => ({
                    ...prev,
                    sizes: [...prev.sizes, size],
                  }));
                }
                e.target.value = '';
              }
            }}
          />
          <div>
            {newProduct.sizes.map((size, index) => (
              <span key={index} onClick={() => {
                setNewProduct((prev) => ({
                  ...prev,
                  sizes: prev.sizes.filter((s) => s !== size),
                }));
              }}>
                {size} <span> <FaTrash className={styles.removeIcon} /></span>
              </span>
            ))}
          </div>
        </div>

</div>


        {/* Add inputs for colors */}

        <div className={styles.inputcontainer}>
<div className={styles.colorSizeMatrialTagcontinaer}>
          <label htmlFor="color" className={styles.label}> Add Color <span> * </span></label>
          <input
            id="color"
            type="text"
            placeholder="Add Color"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                const color = e.target.value.trim();
                if (!newProduct.colors.includes(color)) {
                  setNewProduct((prev) => ({
                    ...prev,
                    colors: [...prev.colors, color],
                  }));
                }
                e.target.value = '';
              }
            }}
          />
         

          <div>
            {newProduct.colors.map((color, index) => (
              <span key={index} onClick={() => {
                setNewProduct((prev) => ({
                  ...prev,
                  colors: prev.colors.filter((c) => c !== color),
                }));
              }}>
                {color} <span> <FaTrash className={styles.removeIcon} /></span>
              </span>
            ))}
          </div>
          </div>

         
        
 {/*add material */}
 <div className={styles.colorSizeMatrialTagcontinaer}>
 <label htmlFor="matrial" className={styles.label}>Add Material</label>
 <input
   id="matrial"
   type="text"
   placeholder="Add Material"
   onKeyDown={(e) => {
     if (e.key === 'Enter' && e.target.value.trim()) {
       const material = e.target.value.trim();
       if (!newProduct.materials.includes(material)) {
         setNewProduct((prev) => ({
           ...prev,
           materials: [...prev.materials, material],
         }));
       }
       e.target.value = '';
     }
   }}
 />


 <div>
   {newProduct.materials.map((material, index) => (
     <span key={index} onClick={() => {
       setNewProduct((prev) => ({
         ...prev,
         materials: prev.materials.filter((m) => m !== material),
       }));
     }}>
       {material} <span><FaTrash className={styles.removeIcon} /></span>
     </span>
   ))}
 </div>

</div>

</div>






        
{/* choouse select  */}
<div  className={styles.inputcontainer}> 
      
<div className={styles.colorSizeMatrialTagcontinaer}>
          <label className={styles.label}> Select Home Page Display  </label>



          <select
            value={newProduct.displayOptions}
            onChange={(e) => setNewProduct({ ...newProduct, displayOptions: e.target.value })}
          >
            <option value="allproducts">All Products</option>
            <option value="latest">Latest</option>
            <option value="future">Future Products</option>
            <option value="toprating">Top Rating</option>
          </select>

      
       
</div>

<div className={styles.colorSizeMatrialTagcontinaer}>
          <label className={styles.label}> Select Category <span> * </span></label>

          <select
            value={newProduct.categoryId || ''}  // Use categoryId for the select value
            onChange={(e) => {
              const selectedCategory = categories.find(category => category._id === e.target.value);
              setNewProduct(prev => ({
                ...prev,
                categoryId: selectedCategory._id,   // Store only categoryId
                categoryName: selectedCategory.name // Store categoryName
              }));
            }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          </div>


         

        </div>


        {/* Image Upload */}




        {/* Coupon Code Input */}
        <div  className={styles.inputcontainer}>
        <div className={styles.colorSizeMatrialTagcontinaer}>
         
          <label htmlFor="coupon" className={styles.label}>Enter Coupon Code</label>
          <input
            type="text"
            id="coupon"
            placeholder="Coupon Code"
            value={newProduct.coupons?.code || ''}
            onChange={(e) => {
              const code = e.target.value.trim();
              setNewProduct((prev) => ({
                ...prev,
                coupons: { ...prev.coupons, code },
              }));
            }}
          />

        
        </div>


        <div className={styles.colorSizeMatrialTagcontinaer}>
        <label htmlFor="Percentage" className={styles.label}>Coupons Discount Percentage</label>

        <input
          type="number"
          id="Percentage"
          placeholder="Discount (%)"
          value={newProduct.coupons?.discount || 0}
          onChange={(e) => {
            const discount = parseFloat(e.target.value);
            setNewProduct((prev) => ({
              ...prev,
              coupons: { ...prev.coupons, discount },
            }));
          }}
        />
      </div>


      <div className={styles.colorSizeMatrialTagcontinaer}>
        <label htmlFor="Couponsenddata" className={styles.label}>Coupons end date</label>
        <input
          type="date"
          id="Couponsenddata"
          value={newProduct.coupons?.validUntil || getFiveDaysAgo()}
          onChange={(e) => {
            const validUntil = e.target.value;
            setNewProduct((prev) => ({
              ...prev,
              coupons: { ...prev.coupons, validUntil },
            }));
          }}
        />

        <FaTrash
          className={styles.removeIcon}
          onClick={() => {
            setNewProduct((prev) => ({
              ...prev,
              coupons: { code: '', discount: 0, validUntil: '' },
            }));
          }}
        />
      </div>

      <div className={styles.colorSizeMatrialTagcontinaer}>
      <div className={styles.fileUploadContainer}>
        <label htmlFor="file" className={styles.label}>Images</label>
        <label htmlFor="fileInput" className={styles.fileUploadLabel}>
          <span className={styles.uploadText}>Choose Files</span>
          <input
            type="file"
            id="fileInput"
            multiple
            onChange={handleImageChange}
            className={styles.fileInput}
          />
        </label>
      </div>

              {/* Image Preview */}

    <div className={styles.imagePreviewContainer}>
    {imagePreviews.map((preview, index) => (

<Image
key={index} src={preview} alt="Preview" className={styles.imagePreview} 


width={500}
height={500}
/>

    ))}
  </div>



    </div>


      </div>



         <div className={styles.inputcontainerbuttons}>
         <div className={styles.inputcontainerbuttonscontainer}>
          <button onClick={handleCreateProduct}>Save Product</button>
          <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
            Cancel
          </button>
          </div>
        </div>


      </div>
    </div>
  )}

</div>




<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartUpdated={cartUpdated} />
    

<WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistUpdated={wishlistUpdated} />

 


    </div>
);

};

export default ProductDetails;


{/* <div className={`${styles.searchfiltersproductcontainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>


<div className={styles.filters}>
  
  <div className={styles.CategorySection}>
    <h3><FaTag /> Category</h3>
    <div className={styles.CategoryList}>
      <ul>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.slice(0, showAllCategories ? categories.length : 5).map((category, index) => (
            <li key={index} onClick={() => handleCategoryClick(category)}>
            <Image
            src={category.categoryImage || "/path/to/default-image.jpg"} // Use default image if categoryImage is not available
            alt={category.name}
            className={styles.previewImage}
            width={200}
            height={200}
            priority
          />

            {category.name} 
            </li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>
      {categories.length > 5 && (
        <button onClick={toggleShowAllCategories}>
          {showAllCategories ? 'Show Less' : 'Show More'}
        </button>
      )}
    </div>
  </div>

  <div className={styles.line}> </div>
 

<div className={styles.tagsSection}>
<h3>Popular Tags</h3>
<div className={styles.tags}>
{tags.length > 0 ? (
  tags.map((tag, index) => (
    <span key={index} className={styles.tag} onClick={() => handleTagClick(tag)}>
      {tag}
    </span>
  ))
) : (
  <span>No tags available</span>
)}
</div>
</div>
  

<div className={styles.line}> </div>


<div className={styles.RatingSection}>
  <h3><FaTag /> Rating</h3>
  <div className={styles.RatingList}>
    <ul>
      {[1, 2, 3, 4, 5].map((rating) => (
        <li key={rating}>
          <label className={styles.ratingLabel}>
            <input
              type="radio"
              name="rating"
              className={styles.ratingRadio}
              value={rating}
              checked={selectedRating === rating}
              onChange={() => handleRatingClick(rating)}
            />
       
            {[...Array(rating)].map((_, index) => (
              <FaStar key={index} size={20} color="#ffc107" />
            ))}
          </label>
        </li>
      ))}
      <li>
        <label className={styles.ratingLabel}>
          <input
            type="radio"
            name="rating"
            className={styles.ratingRadio}
            value=""
            checked={selectedRating === null}
            onChange={() => handleRatingClick(null)} // Deselect all
          />
          <span style={{ marginLeft: '5px' }}>Clear Selection</span>
        </label>
      </li>
    </ul>
  </div>
</div>
  


<div className={styles.line}> </div>
</div>
</div> */}