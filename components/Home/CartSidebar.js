"use client";

import { useEffect, useState } from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { useRouter, usePathname  } from 'next/navigation';
import Image from 'next/image';
import styles from '../../styles/home/CartSidebar.module.css';
import Loader from "../Loader";
import Link from "next/link";
import { TbTrash } from "react-icons/tb";

const CartSidebar = ({ isOpen, onClose, cartUpdated }) => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
 
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, [isOpen, cartUpdated]);

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

        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);




const handleLinkClick = (link) => {


  if (link === pathname) {
    console.log("Same page click, no loader.");
    return; 
  }
  
  console.log(`Navigating to ${link}`);
  setIsLoading(true)

  onClose();
};

useEffect(() => {
  const handlePathChange = () => {
     
    setIsLoading(true);
  };

  const handlePathChangeComplete = () => {
    console.log("Route change completed");
    setIsLoading(false);

  };

  handlePathChange();

  const timeout = setTimeout(() => {
    handlePathChangeComplete();
  }, 500);

  return () => {
    clearTimeout(timeout);
  };
}, [pathname]);

const handleCheckout = () => {
  setIsLoading(true);
  router.push('/order');
  onClose();
};



  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>

    {isLoading && <Loader />} 

      <div className={styles.header}>
        <h2>Shopping Cart</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.cartItems}>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item._id} className={styles.cartItem}>
              
              {/* Product Image */}
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
                <h4>{item.name.length > 12 ? item.name.slice(0, 12) + '..' : item.name}</h4>

                  {/* Price Display */}
              <div className={styles.priceControlContainer}>
              <div className={styles.quantityControlContainer}>
            
             


              <div className={styles.selectedSize}>
              {cart.map((item) => (
  <div key={item._id} className={styles.cartItem}>
    <div className={styles.selectedAttributes}>
      {item?.selectedAttributes &&
        Object.entries(item.selectedAttributes).map(([title, value], index) => (
          <p key={index}>
            <strong>{title}:</strong> {value}
          </p>
        ))}
    </div>
  </div>
))}

              {item?.selectedSize && <p>  {item.selectedSize}</p>}
              
                {item?.selectedColor && <p> {item.selectedColor}</p>}
                
                {item?.material &&  <p>  {item.material}</p>}
                </div>

                 <div className={styles.priceDisplay}>
                  <p>₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              
              <div className={styles.quantityControl}>
                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                <span>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
              </div>
            </div>

              </div>


               

              </div>
</div>


            
              {/* Remove Button */}
              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(item._id)}
              >
                <TbTrash /> Remove
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.footer}>
          <h3>Subtotal <span> ${totalAmount.toFixed(2)} </span></h3>
         

           <Link className={styles.checkoutButton}
          disabled={isLoading}
          onClick={() => handleLinkClick("/order")}
          
          href="/order"
          
          >
           {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Link>

          <p> Shipping, Taxes & Discount Calculate At Checkout </p>
        </div>
      )}

        {isLoading && <div className="loader"><Loader /> </div>}
    </div>
  );
};

export default CartSidebar;


