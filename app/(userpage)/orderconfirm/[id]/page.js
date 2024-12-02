"use client";

// import React, { useEffect, useState, useContext } from 'react';
// import { useRouter, useParams } from 'next/navigation'; // Adjust imports as necessary
// import { AuthContext } from '../../../../components/context/AuthContext'; // Adjust the path as necessary
// import Link from 'next/link';

// const OrderConfirmationPage = () => {
//   const [orderDetails, setOrderDetails] = useState(null);
//   const { user } = useContext(AuthContext);
//   const router = useRouter();
//   const { id } = useParams(); // Fetch the order ID from the URL parameters

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           router.push('/login');
//           return;
//         }

//         const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
//           method: 'GET',
//           headers: { 
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
 
//         if (!response.ok) {
//           const errorData = await response.json();
//           alert(`Error: ${errorData.message}`);
//           router.push('/login');
//           return;
//         }

//         const data = await response.json();
//         setOrderDetails(data.order);
//       } catch (error) {
//         console.error('Error fetching order details:', error);
//         alert('An error occurred while fetching order details. Please try again.');
//       }
//     };

//     fetchOrderDetails();
//   }, [id, router]);

//   if (!orderDetails) {
//     return <div>Loading order details...</div>;
//   }
 
//   return (
//     <div>
//       <h1>Order Confirmation</h1>
//       <p>Order ID: {orderDetails._id}</p>
//       <p>Total Price: {orderDetails.totalPrice}</p>
//       <p>Payment Method: {orderDetails.paymentMethod}</p>
//       <Link href={"/me/myorder"}> Go To my order </Link>
//       <h2>Shipping Address</h2>
//       <p>{orderDetails.shippingAddress.fullName}</p>
//       <p>{orderDetails.shippingAddress.address}</p>
//       <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
//       <p>{orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pinCode}</p>

//       <h2>Order Items</h2>
//       <ul>
//       {orderDetails.orderItems.map((item) => (
//         <li key={item.product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//           {/* Product Image */}
//           {item.product.media && item.product.media.length > 0 && (
//             <img 
//               src={item.product.media[0]}  // Assuming the first image in the media array is the main image
//               alt={item.product.name}
//               style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} 
//             />
//           )}

//           {/* Product Details */}
//           <div>
//             <p>{item.product.name} - Quantity: {item.quantity}</p>
//             <p>Size: {item.size}</p> {/* Display size */}
//             <p>Color: {item.color}</p> {/* Display color */}
//             <p>Price: ${item.product.price}</p>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// );
// }; 

// export default OrderConfirmationPage;



// test cupoan 

// "use client";

// import React, { useEffect, useState, useContext } from 'react';
// import { useRouter, useParams } from 'next/navigation'; // Adjust imports as necessary
// import { AuthContext } from '../../../../components/context/AuthContext'; // Adjust the path as necessary
// import Link from 'next/link';

// const OrderConfirmationPage = () => {
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [finalPrice, setFinalPrice] = useState(0); // State to store final payable price
//   const { user } = useContext(AuthContext);
//   const router = useRouter();
//   const { id } = useParams(); // Fetch the order ID from the URL parameters

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           router.push('/login');
//           return;
//         }
  
//         const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
//           method: 'GET',
//           headers: { 
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         if (!response.ok) {
//           const errorData = await response.json();
//           alert(`Error: ${errorData.message}`);
//           router.push('/login');
//           return;
//         }
  
//         const data = await response.json();
//         setOrderDetails(data.order);
  
//         // Calculate final price based on coupon, if applied
//         if (data.order.coupon && data.order.coupon.discount) {
//           const discount = data.order.coupon.discount;
//           const discountAmount = (data.order.totalPrice * discount) / 100;
//           const finalAmount = data.order.totalPrice - discountAmount;
//           setFinalPrice(finalAmount);
//         } else {
//           setFinalPrice(data.order.totalPrice); // If no coupon, the final price is the total price
//         }
//       } catch (error) {
//         console.error('Error fetching order details:', error);
//         alert('An error occurred while fetching order details. Please try again.');
//       }
//     };
  
//     fetchOrderDetails();
//   }, [id, router]);
  
//   // Adjusting the JSX to show original price, coupon applied, discount, and final price
  

  

//   if (!orderDetails) {
//     return <div>Loading order details...</div>;
//   }


//   return (
//     <div>
//       <h1>Order Confirmation</h1>
//       <p>Order ID: {orderDetails._id}</p>
//       <p>Total Price: ${orderDetails.totalPrice}</p>
//       {orderDetails.coupon && (
//         <p>Coupon Applied: {orderDetails.coupon.name} - {orderDetails.coupon.discount}% off</p>
//       )}
//       <p><strong>Final Payable Amount: ${finalPrice.toFixed(2)}</strong></p>
//       <p>Payment Method: {orderDetails.paymentMethod}</p>
//       <Link href={"/me/myorder"}> Go To my order </Link>
      

//       <div>
//       <h1>Order Confirmation</h1>
//       <p>Order ID: {orderDetails._id}</p>
//       <p>Total Price: ${orderDetails.totalPrice}</p>
//       {orderDetails.coupon && (
//         <p>Coupon Applied: {orderDetails.coupon.name} - {orderDetails.coupon.discount}% off</p>
//       )}
//       <p><strong>Final Payable Amount: ${finalPrice.toFixed(2)}</strong></p>
//       <p>Payment Method: {orderDetails.paymentMethod}</p>
//       {/* Additional UI for shipping address and order items */}
//     </div>
     

      


//       <h2>Shipping Address</h2>
//       <p>{orderDetails.shippingAddress.fullName}</p>
//       <p>{orderDetails.shippingAddress.address}</p>
//       <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
//       <p>{orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pinCode}</p>

//       <h2>Order Items</h2>
//       <ul>
//       {orderDetails.orderItems.map((item) => (
//         <li key={item.product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//           {/* Product Image */}
//           {item.product.media && item.product.media.length > 0 && (
//             <img 
//               src={item.product.media[0]}  // Assuming the first image in the media array is the main image
//               alt={item.product.name}
//               style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} 
//             />
//           )}

//           {/* Product Details */}
//           <div>
//             <p>{item.product.name} - Quantity: {item.quantity}</p>
//             <p>Size: {item.size}</p> {/* Display size */}
//             <p>Color: {item.color}</p> {/* Display color */}
//             <p>Price: ${item.product.price}</p>
//           </div>
//         </li>
//       ))}
//       </ul>
//     </div>
//   );
// };

// export default OrderConfirmationPage;



// import React, { useEffect, useState, useContext } from 'react';
// import { useRouter, useParams } from 'next/navigation'; // Adjust imports as necessary
// import { AuthContext } from '../../../../components/context/AuthContext'; // Adjust the path as necessary
// import Link from 'next/link';

// const OrderConfirmationPage = () => {
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [finalPrice, setFinalPrice] = useState(0);
//   const { user } = useContext(AuthContext);
//   const router = useRouter();
//   const { id } = useParams();

//   useEffect(() => {
//     // const fetchOrderDetails = async () => {
//     //   try {
//     //     const token = localStorage.getItem('token');
//     //     if (!token) {
//     //       router.push('/login');
//     //       return;
//     //     }

//     //     const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
//     //       method: 'GET',
//     //       headers: { 
//     //         'Content-Type': 'application/json',
//     //         Authorization: `Bearer ${token}`,
//     //       },
//     //     });

//     //     if (!response.ok) {
//     //       const errorData = await response.json();
//     //       alert(`Error: ${errorData.message}`);
//     //       router.push('/login');
//     //       return;
//     //     }

//     //     const data = await response.json();
//     //     setOrderDetails(data.order);

//     //     const discount = data.order.coupon ? data.order.coupon.discount : 0;
//     //     const discountAmount = (data.order.totalPrice * discount) / 100;
//     //     const finalAmount = data.order.totalPrice - discountAmount;
//     //     setFinalPrice(finalAmount);
//     //   } catch (error) {
//     //     console.error('Error fetching order details:', error);
//     //     alert('An error occurred while fetching order details. Please try again.');
//     //   }
//     // };


//     const fetchOrderDetails = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           router.push('/login');
//           return;
//         }
    
//         const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
//           method: 'GET',
//           headers: {   
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
    
//         if (!response.ok) {
//           const errorData = await response.json();
//           alert(`Error: ${errorData.message}`);
//           router.push('/login');
//           return;
//         }
    
//         const data = await response.json();
//         setOrderDetails(data.order);
    
//         const discount = data.order.coupon ? data.order.coupon.discount : 0;
//         const discountAmount = (data.order.totalPrice * discount) / 100;
//         const finalAmount = data.order.totalPrice - discountAmount;
//         setFinalPrice(finalAmount);
//       } catch (error) {
//         console.error('Error fetching order details:', error);
//       }
//     };
    

//     fetchOrderDetails();
//   }, [id, router]);

//   if (!orderDetails) {
//     return <div>Loading order details...</div>;
//   }

//   return (
//     <div>
//       <h1>Order Confirmation</h1>
//       <p>Order ID: {orderDetails._id}</p>
//       <p>Total Price: ${orderDetails.totalPrice}</p>
//       {orderDetails.coupon && (
//         <p>Coupon Applied: {orderDetails.coupon.code} - {orderDetails.coupon.discount}% off</p>
//       )}
//       <p><strong>Final Payable Amount: ${finalPrice.toFixed(2)}</strong></p>
//       <p>Payment Method: {orderDetails.paymentMethod}</p>
//       <Link href={"/me/myorder"}> Go To my order </Link>

//       <h2>Shipping Address</h2>
//       <p>{orderDetails.shippingAddress.fullName}</p>
//       <p>{orderDetails.shippingAddress.address}</p>
//       <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
//       <p>{orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pinCode}</p>

//       <h2>Order Items</h2>
//       <ul>
//       {orderDetails.orderItems.map((item) => (
//         <li key={item.product._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//          {/* {item.media && item.media.length > 0 && (
//         <img 
//             src={item.media[0]}  // Assuming the first image in the media array is the main image
//             alt={item.name}
//             style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} 
//           />
//         )} */} 

//          {item.product.media && item.product.media.length > 0 && (
//             <img 
//               src={item.product.media[0]}
//               alt={item.product.name} 
//               style={{ width: '50px', height: '50px', marginRight: '10px', objectFit: 'cover' }} 
//             />
//           )}

//           <div>
            // <p>{item.product.name} - Quantity: {item.quantity}</p>
            // <p>Size: {item.size}</p>
            // <p>Color: {item.color}</p>
            // <p>Price: ${item.product.price}</p>
//           </div>
//         </li>
//       ))}
//       </ul>
//     </div>
//   );
// };

// export default OrderConfirmationPage;









import React, { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import { AuthContext } from '../../../../components/context/AuthContext';
import Link from 'next/link';
import styles from '../../../../styles/home/Orderid.module.css';
import { FaBoxOpen, FaCheckCircle, FaShippingFast, FaCreditCard, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import Image from 'next/image';

const OrderConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
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
    };

    fetchOrderDetails();
  }, [id, router]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }




  return (
    <div className={styles.pageWrapper}>
      {/* Modal-like Card */}
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

<p>Price: ${item.product.price} x {item.quantity}</p>
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

};

export default OrderConfirmationPage;
