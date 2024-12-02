"use client";

import { useEffect, useState } from 'react';
import { FaTrash, FaCartPlus, FaHeart } from 'react-icons/fa';
import styles from '../../styles/home/Wishlist.module.css';
import Link from "next/link";
import Image from "next/image";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setWishlistItems(storedWishlist);
    setCartItems(storedCart);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item._id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // const addToCart = (product) => {
  //   const updatedCart = [...cartItems, product];
  //   setCartItems(updatedCart);
  //   localStorage.setItem('cart', JSON.stringify(updatedCart));
  //   removeFromWishlist(product._id); // Optionally remove from wishlist after adding to cart
  // };

  const trimText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const MAX_NAME_LENGTH = 20; // Set your preferred max length for the name
const MAX_DESCRIPTION_LENGTH = 50;

  return (
    <div className={styles.wishlistPage}>
      <h1 className={styles.heading}> <FaHeart /> Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className={styles.wishlistItems}>
          {wishlistItems.map(item => (

            <div key={item._id} className={styles.wishlistItem}>
<div className={styles.itemImage}>
{item.media && item.media.length > 0 ? (
  
  <>

<Image
               src={item.media[0]} 
               alt={item.name} 
               className={styles.productImage} 
        width={500}
        height={500}
      />




  </>
) : (
  <p className={styles.noImageText}>No Image Available</p>
)}
</div>

<div className={styles.itemDetails}>
  
<h2 className={styles.productName}>
  {trimText(item.name, MAX_NAME_LENGTH)}
</h2>
<p className={styles.productDescription}>
  {trimText(item.description, MAX_DESCRIPTION_LENGTH)}
</p>     
<p className={styles.productPrice}>
${item.price.toFixed(2)}
</p>        
</div>

              
 
              <div className={styles.actions}>
                <button
                  className={styles.addToCartButton}
                  
                >
                <Link  className={styles.link} href={`/product/details/${item._id}`}> 
                  <FaCartPlus /> Add to Cart
                </Link>

                </button>
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromWishlist(item._id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

