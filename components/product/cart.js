
"use client";

import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import styles from '../../styles/home/Cart.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const currentQuantity = item.quantity || 1;
        const newQuantity = currentQuantity + delta;
  
        if (newQuantity < 1) {
          alert("Quantity cannot be less than 1.");
          return item;
        }
  
        if (newQuantity > 10) {
          alert("Quantity cannot be more than 10.");
          return item;
        }
  
        if (delta > 0 && newQuantity > currentQuantity)
  
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
  
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);


  const handleCheckout = () => {
    router.push('/order'); // Example redirect to a checkout page
  };

  return (
    <div className={styles.cartPage}>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className={styles.cartItems}>
          {cartItems.map(item => (
            <div key={item._id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                {/* Display main image */}
                <Image
                src={item.media[0] || '/default-image.png'}
                alt={item.name}
                width={100}
                height={100}
              />

              </div>
              <div className={styles.itemDetails}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
               
                <p>${totalAmount}</p>
               
                <div className={styles.quantityControl}>
                  <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                  <span>{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                </div>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(item._id)}
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}
          <button className={styles.checkoutButton} onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

