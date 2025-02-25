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
  FaEye,
  FaArrowLeft, FaArrowRight,
  FaShoppingCart,
 } from 'react-icons/fa';
import Image from "next/image";
import CartSidebar from "../../../components/Home/CartSidebar";
import WishlistSidebar from "../../../components/Home/WishlistSidebar";
import { useRouter } from 'next/navigation';

import ReactPaginate from 'react-paginate';

const SearchBarPage = () => {
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
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  
  const [products, setProducts] = useState([]);
 
 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
 
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

const toggleSidebar = () => {
  setIsSidebarOpen((prev) => !prev); // Toggle sidebar state
};

const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 12;

const [showAllTags, setShowAllTags] = useState(false);
const toggleShowAllTags = () => setShowAllTags(!showAllTags);



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
      finally {
        setLoading(false);
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
        setLoading(true);
        const response = await axios.get('/api/user/product/search/tag');
        setTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
      finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/category/cate');
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
      finally {
        setLoading(false);
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

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const displayedProducts = 
  (selectedRating ? filteredProducts : query ? suggestions : initialProducts).slice(startIndex, endIndex);
  
  
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
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

  const filterProducts = useCallback(async () => {
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
  },[ initialProducts, selectedRating, selectedCategory, minPrice, maxPrice ]);



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


  // const toggleSidebar = () => {
  //   setIsSidebarOpen(prevState => !prevState);
  // };


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
        width={50}
        height={50}
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



  const ProductCard = ({ product }) => (
    <div className={styles.productItem}>
      <div className={styles.product_iconsto}> 
        <FaEye onClick={() => openQuickView(product)} />
      </div>
      <Link href={`/product/details/${product._id}`}>
      <div className={styles.mainproduct_images}>
      <Image
        className={styles.product_list_images}
        src={product.media[0] || ""}
        alt={product.name}
        width={500}
        height={500}
      />
    </div>

      </Link>
      <div className={styles.product_list_containet}>
        <h4>{product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}</h4>
        
        <p className={styles.conmmanClassname}>{renderRating(product.averageRating)}</p>


        <div className={styles.price_containet}>
          <p className={styles.price}>₹{product.price}</p>
          <p className={styles.discountPrice}>₹{product.discountPrice}</p>
        </div>
        {/* <p className={styles.white_space}>Sales: {product.salesCount} | Views: {product.viewsCount}</p> */}
        
        <div className={styles.product_icons}>
          <FaHeart
            onClick={() => handleAddToWishlist(product)}
            style={{ color: isInWishlist(product._id) ? "rgb(242, 62, 20)" : "inherit" }}
          />
          <FaShoppingCart
            onClick={() => handleAddToCart(product)}
            style={{ color: isInCart(product._id) ? "rgb(242, 62, 20)" : "inherit" }}
          />
        </div>
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

          
         
          <h2 className={styles.product_name} >{product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}</h2>
          {/* <p className={styles.product_des} >{product.description.slice(0, 200)}...</p> */}
          <p  className={styles.product_des}>{product.description.length > 45 ? product.description.slice(0, 45) + "..." : product.description}</p>

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
    <div className={`${styles.searchfiltersproductcontainer} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.filters}>

        <div className={`${styles.sidebarToggle} ${styles.filtersidebarToggleclose}`} onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes size={30} /> : <FaBars size={35} />}
      </div>
      
          {/* Category Filter */}
          <div className={styles.CategorySection}>

          <h3>Category</h3>

         
        
            

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

                    {category.name} {/* Changed to display category name */}
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
          {/* Rating Filter */}

          <div className={styles.RatingSection}>
          {/* <h3><FaTag /> Rating</h3> */}
          <h3>Rating</h3>
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
                    {/* Display the correct number of stars for each rating */}
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

          {/* Sort Options */}
          <div className={styles.sortOptions}>
            <label>
              <input
                type="checkbox"
                checked={sortByLatest}
                className={styles.sortOptionsinput}
                onChange={() => setSortByLatest((prev) => !prev)}
              />
              <FaSortAmountUp /> Sort by Latest
            </label>
            <label>
              <input
                type="checkbox"
                checked={sortByPrice}
                className={styles.sortOptionsinput}
                onChange={() => setSortByPrice((prev) => !prev)}
              />
              <FaSortAmountDown /> Sort by Price
            </label>
          </div>

          <div className={styles.line}> </div>

          {/* Price Range Filter */}
          {/* <div className={styles.priceFilter}>
            <label>
              <FaFilter /> <h3> Price Range</h3>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={minPrice}
                  onChange={handleMinRangeChange}
                  className={styles.rangeInput}
                />
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={maxPrice}
                  onChange={handleMaxRangeChange}
                  className={styles.rangeInput}
                />
                <div className={styles.rangeFill} style={{ left: `${(minPrice / 100000) * 100}%`, right: `${100 - (maxPrice / 100000) * 100}%` }} />
              </div>
              <span className={styles.rangeValue}>${minPrice} - ${maxPrice}</span>
            </label>
          </div>

          <div className={styles.line}> </div> */}
             {/* Popular Tags Section */}
        <div className={styles.tagsSection}>
        <h3>Popular Tags</h3>
        <div className={styles.tags}>
          {/* {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span key={index} className={styles.tag} onClick={() => handleTagClick(tag)}>
                {tag}
              </span>
            ))
          ) : (
            <span>No tags available</span>
          )} */}


{tags.length > 0 ? (
  tags.slice(0, showAllTags ? tags.length : 10).map((tag, index) => (
    <span key={index} className={styles.tag} onClick={() => handleTagClick(tag)}>
      {tag}
    </span>
  ))
) : (
  <span>No tags available</span>
)}
{tags.length > 10 && (
  <button onClick={toggleShowAllTags}>
    {showAllTags ? 'Show Less' : 'Show More'}
  </button>
)}

        </div>
      </div>

      <div className={styles.line}> </div>
        </div>
      </div>


          {/* Product Display */}
{/* Product Display */}
<div className={styles.products}>
 
   
  

  {/* Search Input */}
  <div className={styles.searchBar}>
  
  <div className={styles.sidebarToggle} onClick={toggleSidebar}>
    {isSidebarOpen ? <FaTimes size={35} /> : <FaBars size={35} />}
  </div>

    <input
      type="text"
      value={query}
      onChange={handleSearchChange}
      placeholder="Search products..."
      className={styles.searchInput}
      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
    />
    <button onClick={handleSearchSubmit}>
      <FaSearch />
    </button>
  </div>

  {/* Product Listing */}
  <h4 className={styles.allheading}>
    {selectedRating ? `Filtered Products with ${selectedRating} Star Rating` : 'All Products'}
  </h4>

  {/* <div className={styles.productsGrid}>
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
  </div> */}


<div className={styles.productsGrid}>
  {selectedRating && filteredProducts.length > 0 ? (
    displayedProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : query && suggestions.length > 0 ? (
    displayedProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : suggestions.length > 0 ? (
    displayedProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : !query && initialProducts.length > 0 ? (
    displayedProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : initialProducts.length > 0 ? (
    displayedProducts.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))
  ) : (
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





<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartUpdated={cartUpdated} />
    

<WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistUpdated={wishlistUpdated} />

 

<ReactPaginate
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        
        breakLabel={"..."}
       
        pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
        
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
      
        onPageChange={handlePageChange}
       
        containerClassName={styles.pagination}
        activeClassName={styles.active}
        pageLinkClassName={styles.page_link}
        previousLinkClassName={styles.prev_link}
        nextLinkClassName={styles.next_link}
      />
      
    </div>
);

};

export default SearchBarPage;

