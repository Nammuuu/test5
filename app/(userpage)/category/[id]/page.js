

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter, useParams } from 'next/navigation'; 
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loader from "../../../../components/Loader";
// // import styles from "../../../../styles/components/category.module.css";
// import { FaHeart, FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
// import Link from "next/link";
// import Image from "next/image";
// import styles from "../../../../styles/home.module.css";

// const CategoryPage = () => {
//   const router = useRouter();
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch products based on category ID
//   useEffect(() => {
//     if (id) {
//       const fetchProducts = async () => {
//         try {
//           setLoading(true);
//           const response = await axios.get(`/api/user/category?category=${id}`);
//           setProducts(response.data.products);
//         } catch (error) {
//           console.error("Error fetching products:", error);
//           toast.error("Failed to fetch products.");
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchProducts();
//     }
//   }, [id, router]);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className={styles.categoryContainer}>
//       <h1>Products in this Category</h1>
//       <div className={styles.productList}>
//         {products.map((product) => (
//           <div key={product._id} className={styles.productItem}>
//             <Image
//               src={product.media[0] || "/default-image.png"}
//               alt={product.name}
//               width={200}
//               height={200}
//               className={styles.productImage}
//             />
//             <div className={styles.productDetails}>
//               <h2>{product.name}</h2>
//               <p>{product.description}</p>
//               <div className={styles.productActions}>
//                 <FaHeart className={styles.icon} />
//                 <FaShoppingCart className={styles.icon} />
//                 <FaEye className={styles.icon} />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;



"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useParams } from 'next/navigation'; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";


import CartSidebar from '../../../../components/Home/CartSidebar';
import WishlistSidebar from '../../../../components/Home/WishlistSidebar';



import {
    FaHeart, FaEye, FaShoppingCart, FaStar,
     FaSearch, FaBars, FaTimes, FaTag, FaFilter,
    FaSortAmountUp, FaSortAmountDown,
    FaArrowLeft, FaArrowRight
  } from 'react-icons/fa';
  
  
  import ReactPaginate from 'react-paginate';
import Link from "next/link";
import Image from "next/image";
import styles from "../../../../styles/home.module.css";

// import ReactPaginate from 'react-paginate';

const CategoryPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch products based on category ID
  useEffect(() => {
    if (id) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/user/category?category=${id}`);
          setProducts(response.data.products);
        } catch (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to fetch products.");
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [id, router]);

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

          <h2 className={styles.product_name} >{product.name}</h2>
          <p className={styles.product_des} >{product.description.slice(0, 200)}...</p>
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



  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };


  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedMaterial(null);
  };


  
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const displayedProducts = products.slice(startIndex, endIndex);
  

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  



  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.categoryContainer}>
      <h1>Products in this Category</h1>
      <div className={styles.products_grid}>
        {displayedProducts.map((product) => (
        
            <div className={styles.product_card} key={product._id}
            >
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
                <h4>{product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}</h4>
                <p className={styles.conmmanClassname}>{renderRating(product.averageRating)}</p>
                <div className={styles.price_containet}>
                  <p className={styles.price}>₹{product.price}</p>
                  <p className={styles.discountPrice}>₹{product.discountPrice}</p>
                </div>
                <p>Sales: {product.salesCount} | Views: {product.viewsCount}</p>
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
          </div>

        ))}
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


      {isCartOpen && <CartSidebar isOpen={isCartOpen} setIsOpen={setIsCartOpen} />}
{isWishlistOpen && <WishlistSidebar isOpen={isWishlistOpen} setIsOpen={setIsWishlistOpen} />}


<CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartUpdated={cartUpdated} />
    

<WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistUpdated={wishlistUpdated} />

<ReactPaginate
  previousLabel={<FaArrowLeft />}
  nextLabel={<FaArrowRight />}
  breakLabel={"..."}
  pageCount={Math.ceil(products.length / itemsPerPage)}
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

export default CategoryPage;
