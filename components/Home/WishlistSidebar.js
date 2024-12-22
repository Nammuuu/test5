


"use client";

import { useState, useEffect } from 'react';
import styles from '../../styles/home/CartSidebar.module.css';
// import styles from '../../styles/home/WishlistSidebar.module.css'; // Ensure this CSS file exists
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { TbTrash } from "react-icons/tb";
import Image from 'next/image';
import Loader from "../Loader";
import Link from "next/link";


const WishlistSidebar = ({ isOpen, onClose, wishlistUpdated }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchWishlist = () => {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlist(savedWishlist);
    };

    fetchWishlist(); // Fetch wishlist data whenever `isOpen` or `wishlistUpdated` changes
  }, [isOpen, wishlistUpdated]);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.info('Item removed from wishlist');
  };


  const handleLinkClick = (link) => {
    // if (link === pathname) {
    //   console.log("Same page click, no loader.");
    //   return;
    // }
    // setIsLoading(true);
    // router.push('/order');
  
    if (link === pathname) {
      console.log("Same page click, no loader.");
      return; // Don't trigger loading for the same page
    }
    
    console.log(`Navigating to ${link}`);
    setIsLoading(true)
  
    onClose();
  };


  
  const totalAmount = wishlist.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);


  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>

{isLoading && <Loader />} 

<div className={styles.header}>
        <h2>Your wishlist</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <FaTimes />
        </button>
      </div>

      
      
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={styles.wislistsidebar}>
          {wishlist.map(item => (
           
            <div key={item._id} className={styles.cartItem}>
              
              {/* Product Image */}
        <Link   className={styles.link} href={`/product/details/${item._id}`}>
              <div className={styles.contentcartItem}>
              <div className={styles.itemImage}>
                <Image
                  src={item.media[0] || '/default-image.png'}
                  alt={item.name}
                  width={500}
                  height={500}
                  className={styles.cartImage}
                />
              </div>

              {/* Product Details */}
              <div className={styles.itemDetails}>
                <h4>{item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}</h4>

                  {/* Price Display */}
              <div className={styles.priceControlContainer}>
              <div className={styles.quantityControlContainer}>
            
              <div className={styles.selectedSize}>
              {item?.selectedSize && <p>  {item.selectedSize}</p>}
              
                {item?.selectedColor && <p> {item.selectedColor}</p>}
                
                {item?.material &&  <p>  {item.material}</p>}
                </div>

                 <div className={styles.priceDisplay}>
                  <p>₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              
             
            </div>

              </div>


               

              </div>
</div>
</Link>


            
              {/* Remove Button */}
              <button
                className={styles.removeButton}
                onClick={() => removeFromWishlist(item._id)}
              >
                <TbTrash /> Remove
              </button>
            </div>

             
         
          ))}
        </div>
      )}

      

      {wishlist.length > 0 && (
        <div className={styles.footer}>
          <h3>Subtotal: <span> ${totalAmount.toFixed(2)} </span></h3>
        </div>
      )}
      
      {isLoading && <div className="loader"><Loader /> </div>}

    </div>
  );
};

export default WishlistSidebar;
