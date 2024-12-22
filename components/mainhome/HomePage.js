
"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import CartSidebar from '../Home/CartSidebar';
import WishlistSidebar from '../Home/WishlistSidebar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../Loader";
import Link from 'next/link';
import Image from 'next/image';
import styles from "../../styles/home.module.css";
import {
  FaStar, FaSearch, FaBars, FaTimes, FaTag, FaFilter,
  FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaShoppingCart,
  FaArrowLeft, FaArrowRight
} from 'react-icons/fa';

 
import ReactPaginate from 'react-paginate';

const HomePage = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/product/home', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
        toast.error('Failed to fetch products: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      existingItem.quantity += 1;
      cart = cart.map((item) => item._id === product._id ? existingItem : item);
      toast.success(`Increased quantity of ${product.name}`);
    } else {
      cart.push(newItem);
      toast.success(`Added ${product.name} to cart`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartUpdated(prev => !prev);
    setIsCartOpen(true);
  };

  const handleAddToCart = (product) => {
    if (product.sizes.length > 0 && !selectedSize) {
      openQuickView(product);
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
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingItem = wishlist.find((item) => item._id === product._id);

    if (existingItem) {
      toast.info(`${product.name} is already in your wishlist.`);
    } else {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success(`Added ${product.name} to wishlist`);
      setWishlistUpdated(prev => !prev);
    }
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
    setQuickViewProduct(product);
  };


  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedMaterial(null);
  };

  const ProductOptions = ({ options, label, selectedOption, setSelectedOption }) => (
    options && options.length > 0 && (
      <div className={styles.selector_container}>
        <label>{label}:</label>
        <div className={styles.options}>
          {options.map(option => (
            <button
              key={option}
              className={`${styles.option} ${selectedOption === option ? styles.selected : ""}`}
              onClick={() => setSelectedOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
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

          <h2 className={styles.product_name} >{product.name.slice(0, 30)}...</h2>
        
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


  const ProductList = ({ title, displayOption }) => {v
  const filteredProducts = products.filter(p => p.displayOptions === displayOption);
  

   // Pagination settings
   const itemsPerPage = 8; 
   const [currentPage, setCurrentPage] = useState(0);
 
   // Calculate current products to display
   const offset = currentPage * itemsPerPage;
   const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);
 
   // Handle page change
   const handlePageClick = (event) => {
     setCurrentPage(event.selected);
   };

  if (filteredProducts.length === 0) {
    return null; 
  }

  return (
    <div className={`${displayOption}Container`}>
      <h1 className={styles.title_heading}>{title}</h1>

      <div className={styles.products_grid}>
        {currentProducts.map(product => (
          <div className={styles.product_card} key={product._id}>
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
              
               {product?.seles && (
  <h3 className={styles.selstagt}>{product.seles}</h3>
)}

                <h4>{product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}</h4>
                <p className={styles.conmmanClassname}>{renderRating(product.averageRating)}</p>
                <div className={styles.price_containet}>
                  <p className={styles.price}>₹{product.price}</p>
                  <p className={styles.discountPrice}>₹{product.discountPrice}</p>
                </div>
                <p className={styles.white_space}>Sales: {product.salesCount} | Views: {product.viewsCount}</p>
                <div className={styles.product_icons}> 
                  <FaHeart
                    onClick={() => handleAddToWishlist(product)}
                    style={{ color: isInWishlist(product._id) ? "rgb(242, 62, 20)" : "red" }}
                  />
                  <FaShoppingCart
                    onClick={() => handleAddToCart(product)}
                    style={{ color: isInCart(product._id) ? "rgb(242, 62, 20)" : "inherit" }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={<FaArrowLeft />}
          nextLabel={<FaArrowRight />}
          pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          pageLinkClassName={styles.page_link}
          previousLinkClassName={styles.prev_link}
          nextLinkClassName={styles.next_link}
        />
      )}
    </div>
  );
};


  
  
  if (loading) {
    return <Loader />; 
  }



  return (
    <div className={styles.hompagemaincontainerproduct}>
    {loading && <Loader />}
       
  
      <div className={styles.productsGridmainreturn}>
        <ProductList title="All Products" displayOption="allproducts" />
        <ProductList title="Latest Products" displayOption="latest" />
        <ProductList title="Recommended Products" displayOption="recommended" />
        <ProductList title="Future Products" displayOption="future" />
        <ProductList title="Top Rated Products" displayOption="toprating" />
      </div>


{isCartOpen && <CartSidebar isOpen={isCartOpen} setIsOpen={setIsCartOpen} />}
{isWishlistOpen && <WishlistSidebar isOpen={isWishlistOpen} setIsOpen={setIsWishlistOpen} />}

<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartUpdated={cartUpdated} />
    

<WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistUpdated={wishlistUpdated} />



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
  );
};

export default HomePage;
