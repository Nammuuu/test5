"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import { AuthContext } from '../../../../components/context/AuthContext';
import Link from 'next/link';
import styles from '../../../../styles/home/Orderid.module.css';
import { FaBoxOpen, FaCheckCircle, FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import Image from 'next/image';
import Loader from "../../../../components/Loader";

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

      <div className={styles.conatinerorserid}> 
     
      <div className={styles.displayflexx}>
      <FaCheckCircle className={styles.confirmIcon} />
      {/* <p><strong>Order ID:</strong> {orderDetails._id}</p> */}
      <p><strong>Thank you for </strong> {orderDetails.shippingAddress.fullName}</p>
      </div>
      
     
     </div>



         

        <div className={styles.gridContainer}>        

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

      </div>

      <div className={styles.modalHeader}>
        
      <h1>Thank You for Your Purchase!</h1>
      <p>Your order has been placed successfully. We will notify you once its shipped.</p>
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




  // {orderDetails.coupon && (
  //   <p>Coupon Applied: {orderDetails.coupon.code} - {orderDetails.coupon.discount}% off</p>
  // )}
  // return (
  //   <div >
  //     <h1>Order Confirmation</h1>
  //     <p>Order ID: {orderDetails._id}</p>
  //     <p>Total Price: ${orderDetails.totalPrice}</p>

      
  //     {orderDetails.coupon && orderDetails.coupon.code && orderDetails.coupon.discount != null && (
  //       <p>Coupon Applied: {orderDetails.coupon.code} - {orderDetails.coupon.discount}% off</p>
  //     )}

      
     
  //     <p><strong>Final Payable Amount: ${finalPrice.toFixed(2)}</strong></p>
  //     <p>Payment Method: {orderDetails.paymentMethod}</p>
  //     <Link href={"/me/myorder"}> Go To My Orders </Link>

  //     <h2>Shipping Address</h2>
  //     <p>{orderDetails.shippingAddress.fullName}</p>
  //     <p>{orderDetails.shippingAddress.address}</p>
  //     <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
  //     <p>{orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pinCode}</p>

  //     <h2>Order Items</h2>
  //     <ul>
  //       {orderDetails.orderItems.map((item) => (
  //         <li key={item.product?._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
  //         {/* Display product image if available */}
  //         {item.product && item.product.media && item.product.media.length > 0 ? (
  //           <img 
  //             src={item.product.media[0]} 
  //             alt={item.product.name} 
  //             style={{ width: '50px', height: '50px', marginRight: '10px' }}
  //           />
  //         ) : (
  //           <span>No Image Available</span>
  //         )}
  //         {/* Display product name */}
  //         <div>{item.product?.name || "Unnamed Product"}</div>
  //       </li>
        
  //       ))}
  //     </ul>
  //   </div>
  // );




//   return (
//     <div className={styles.orderConfirmationContainer}>
//       <h1 className={styles.heading}>Order Confirmation</h1>

//       <div className={styles.section}>
//       <h2 className={styles.subHeading}>Order Items</h2>

//         <ul className={styles.orderItemsList}>
//           {orderDetails.orderItems.map((item) => (
//             <li key={item.product?._id} className={styles.orderItem}>
//               {item.product && item.product.media && item.product.media.length > 0 ? (
//                 <img 
//                 loading="lazy"
//                   src={item.product.media[0]} 
//                   alt={item.product.name} 
//                   className={styles.productImage}
//                 />
//               ) : (
//                 <span className={styles.noImage}>No Image Available</span>
//               )}
//               <div className={styles.productName}>
//               <p> {item.product?.name || "Unnamed Product"}</p>
             
              
             
             
//               <div className={styles.sizecolor}>
//                {item?.product?.price && <p>Price:  ${item.product.price} x {item.quantity}</p>}
//             {item?.size && <p>{item.size}</p>}
//             {item?.color && <p>{item.color}</p>}
//              </div>

            
          
//           </div>
//             </li>
//           ))}
//         </ul>
//               <Link href={"/me/myorder"} className={styles.orderLink}>
//   Go To My Orders
// </Link>


// <div className={styles.Purchase}>
// <h1>Thank You for Your Purchase!</h1>
// <p>Your order has been successfully placed. We appreciate your trust in us and are excited to get your items delivered to you.</p>
// <p><strong>What’s Next?</strong></p>
// <ul>
// <li>We'll notify you once your order has been shipped.</li>
// <li>You can track your order's progress in your account.</li>
// </ul>

// <p>If you have any questions, feel free to reach out to our support team.</p>
// <p>Thank you for choosing us!</p>
// </div>

//       </div>

//       <div className={styles.section}>
//       <h2 className={styles.subHeading}>Order details</h2>
//         <p className={styles.orderInfo}><strong>Order ID:</strong> {orderDetails._id}</p>
//         <p className={styles.orderInfo}><strong>Total Price:</strong> ${orderDetails.totalPrice.toFixed(2)}</p>

//         {orderDetails.coupon && orderDetails.coupon.code && orderDetails.coupon.discount != null && (
//           <p className={styles.couponInfo}>
//             <strong>Coupon Applied:</strong> {orderDetails.coupon.code} - {orderDetails.coupon.discount}% off
//           </p>
//         )}

        
//         <p className={styles.paymentMethod}>
//           <strong>Payment Method:</strong> {orderDetails.paymentMethod}
//         </p>

//         <p className={styles.paymentMethod}>
//           <strong>Order Status:</strong> {orderDetails.orderStatus}
//         </p>




//         <div className={styles.insection}>
//         <h2 className={styles.subHeading}>Shipping Address</h2>
//         <p>Full Name: <span> {orderDetails.shippingAddress.fullName}</span> </p>
//         <p> Address: <span>{orderDetails.shippingAddress.address}</span></p>
//         <p> Address2: <span>{orderDetails.shippingAddress.address2}</span> </p>
//         <p> City: <span>{orderDetails.shippingAddress.city} </span> </p>    

//         <p> State: <span> {orderDetails.shippingAddress.state} </span></p>          
//         <p> Landmark: <span>{orderDetails.shippingAddress.landmark}</span>  -  PhoneNo:  <span>{orderDetails.shippingAddress.phoneNo}</span> </p>
//         <p> Country: <span>{orderDetails.shippingAddress.country} </span>  - PinCode:   <span> {orderDetails.shippingAddress.pinCode}</span></p>
//       </div>

//       </div>

      
//     </div>
//   );
