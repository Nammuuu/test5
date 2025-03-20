"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import { AuthContext } from '../../../../components/context/AuthContext';
import Link from 'next/link';
import styles from '../../../../styles/home/Orderid.module.css';
import { FaBoxOpen, FaCheckCircle, FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import Image from 'next/image';
import Loader from "../../../../components/Loader";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const OrderConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
          method: 'GET',
          headers: {  
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          router.push('/login');
          return;
        }

        const data = await response.json();
        setOrderDetails(data.order);

        const discount = data.order.coupon ? data.order.coupon.discount : 0;
        const discountAmount = (data.order.totalPrice * discount) / 100;
        const finalAmount = data.order.totalPrice - discountAmount;
        setFinalPrice(finalAmount);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } 
      finally {
        setLoading(false);
      }
    };

    const clearCart = () => {
      localStorage.removeItem("cart");
      // localStorage.removeItem("cartItems");
    };
    clearCart();
    fetchOrderDetails();
  }, [id, router]);


  // useEffect(() => {
    
  // }, [id]);

  
  if (!orderDetails) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />; 
  }




  return (
    <div className={styles.pageWrapper}>
      {/* Modal-like Card */}
      {loading && <Loader />}
      <div className={styles.modalBox}>
<div className={styles.modalHeader}>
        
        <h1>Thank You for Your Purchase!</h1>
        <p>Your order has been placed successfully. We will notify you once its shipped.</p>
     </div>
         

        <div className={styles.gridContainer}>        


        <div className={styles.orderItemsSection}>
          <h2><FaBoxOpen /> Your Order</h2>
          <ul className={styles.orderItemsList}>
            {orderDetails.orderItems.map((item) => (
              <li key={item.product?._id} className={styles.orderItem}>
                {item.product && item.product.media && item.product.media.length > 0 ? (
                 
                  
                  <Image
                 
                    src={item.product.media[0]} 
                    alt={item.product.name} 
                    className={styles.productImage}
                  width={150}
                  height={150}
                  
                  priority
                />

                ) : (
                  <span className={styles.noImage}>No Image Available</span>
                )}
                <div className={styles.productDetails}>
                  
                  <p>{item.product?.name.length > 30 ? item.product?.name.slice(0, 30) + "..." : item.product?.name || "Unnamed Product" }</p>

<p>Price: ${item.product?.price} x {item.quantity}</p>
                  <div className={styles.sizecolor}>

                  {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
          <div className={styles.sizecolor}>
            {Object.entries(item.selectedAttributes).map(([title, value]) => (
              <p key={title}>
                <strong>{title}:</strong> {value}
              </p>
            ))}
          </div>
        )}
        
                  {item?.size && <p>{item.size}</p>}
                  {item?.color && <p>{item.color}</p>}
              
            </div>

                  
                </div> 
              </li>
            ))}
          </ul>

          <div className={styles.orderDetailsSectio}>
          <h2><FaClipboardList /> Order Details</h2>
          <p><strong>Order Status:</strong> {orderDetails.orderStatus}</p> 
          {orderDetails.coupon && orderDetails.coupon.code && orderDetails.coupon.discount != null && (
            <p><strong>Coupon:</strong> {orderDetails.coupon.code} - {orderDetails.coupon.discount}% off</p>
          )}
          <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
                    
          <p><strong>Total Price:</strong> ${orderDetails.totalPrice.toFixed(2)}</p>
         

        </div> 

        </div>

          <div className={styles.shippingAddressSectionx}>
            <h2><FaMapMarkerAlt /> Shipping Address</h2>
            <div className={styles.shippingAddressSection}>

            
<div>
            <p><strong>Address:</strong> {orderDetails.shippingAddress.address}</p>
            {orderDetails.shippingAddress.address2 && <p><strong>Address 2:</strong> {orderDetails.shippingAddress.address2}</p>}
            <p><strong>Landmark:</strong> {orderDetails.shippingAddress.landmark}</p>
            </div>

            <div>
            <p><strong>City:</strong> {orderDetails.shippingAddress.city}</p>
            <p><strong>State:</strong> {orderDetails.shippingAddress.state}</p>
            <p><strong>Country:</strong> {orderDetails.shippingAddress.country}</p>
            <p><strong>PinCode:</strong> {orderDetails.shippingAddress.pinCode}</p>
            <p><strong>Phone:</strong> {orderDetails.shippingAddress.phoneNo}</p>
            </div>

           
            </div>
          </div>
 


      </div>


   
      <div className={styles.actionSectionx}>
      <Link href={"/me/myorder"} className={styles.trackOrderButtonto}>
        Track My Order
      </Link>

      <Link href={"/"} className={styles.trackOrderButton}>
     Continue Shopping
    </Link>
    </div>

      </div>

  
    </div>
  );
  



};

export default OrderConfirmationPage;
