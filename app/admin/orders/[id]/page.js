

"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import styles from '../../../../styles/admin/order/OrderId.module.css'; // Import the CSS module
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import Image from "next/image";
// import  Sidebar from "../../components/Sidebar"
import Loader from "../../../../components/Loader";
// import ReactPaginate from 'react-paginate';
import  Navbar from "../../../../components/Nav"

const AdminOrderPage = ({ params }) => {
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = params;

  // Fetch order details by ID
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    } 
  
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data.order);  // Access the order object directly
        setOrderStatus(data.order.orderStatus);  // Set the order status from the nested order object
      } catch (error) {
        toast.error('Error fetching order');
      }
    };
  
    fetchOrder();
  }, [id, router]);

  const updateOrderStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      setLoading(true);
      await axios.put(
        `/api/admin/orders/${id}`,
        { orderStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error updating order status');
    }
  };

  const deleteOrder = async () => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Order deleted successfully');
        router.push('/admin/dashboard');
      } catch (error) {
        toast.error('Error deleting order');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Processing':
        return styles.orderStatusProcessing;
      case 'Cancelled':
        return styles.orderStatusCancelled;
      case 'Delivered':
        return styles.orderStatusDelivered;
      case 'Pending':
        return styles.orderStatusPending;
      default:
        return '';
    }
  };

  const calculateFinalPrice = () => {
    let totalPrice = 0;
  
    // Loop through each order item to calculate total price (price * quantity)
    order.orderItems.forEach(item => {
      const itemTotal = item.product?.price * item.quantity;  // Multiply price by quantity
      totalPrice += itemTotal;  // Add each product's total price to the total
    });
  
    // Apply coupon discount if available
    let discount = 0;
    if (order.coupon && order.coupon.discount) {
      discount = (totalPrice * order.coupon.discount) / 100;
    }
  
    const finalPrice = totalPrice - discount;
  
    return {
      totalPrice,
      discount,
      finalPrice
    };
  };
  
  


const generatePDF = (order) => {
  const doc = new jsPDF();
  
  // Set margin and spacing variables
  const marginX = 10;
  let currentY = 10; // Tracks Y position on the PDF for dynamic content placement
  
  // Add title
  doc.setFontSize(16);
  doc.text(`Invoice for Order ID: ${order._id}`, marginX, currentY);
  currentY += 10;

  // Add user details
  doc.setFontSize(12);
  doc.text(`User Email: ${order.user.email}`, marginX, currentY);
  currentY += 10;
  
  // Add shipping address
  doc.text(`Shipping Address:`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.fullName}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.address2}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.country}, ${order.shippingAddress.pinCode}`, marginX, currentY);
  currentY += 10;

  // Define columns and data for the table
  const columns = [
    { header: 'Product', dataKey: 'productName' },
    { header: 'Quantity', dataKey: 'quantity' },
    { header: 'Size', dataKey: 'size' },
    { header: 'Color', dataKey: 'color' },
    { header: 'Price', dataKey: 'price' },
    { header: 'Attributes', dataKey: 'attributes' },
  ];

  // const data = order.orderItems.map((item) => ({
  //   productName: item.product?.name || 'N/A', // Fallback to 'N/A' if product or name is unavailable
  //   quantity: item.quantity,
  //   size: item.size || 'N/A', // Fallback for size
  //   color: item.color || 'N/A', // Fallback for color
  //   price: item.product?.price || 'N/A', // Fallback for price
  // }));

  const data = order.orderItems.map((item) => ({
    productName: item.product?.name || 'N/A',
    quantity: item.quantity || 0,
    price: item.product?.price || 'N/A',
    size: item.size || 'N/A',
    attributes: item.selectedAttributes 
      ? Object.entries(item.selectedAttributes).map(([key, value]) => `${key}: ${value}`).join(', ') 
      : 'N/A',
  }));

  

  // Add product table
  doc.autoTable({
    head: [columns],
    body: data.map(row => [
      row.productName,
      row.quantity,
      row.size,
      row.color,
      row.price,
      row.attributes,
    ]),
    startY: currentY,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 50 },
      5: { cellWidth: 30 },
    }
  });

  // Update Y position after table
  currentY = doc.lastAutoTable.finalY + 10;

  // Add additional order details
  doc.text(`Total Price: ${order.totalPrice}`, marginX, currentY);
  currentY += 7;
  doc.text(`Order Status: ${order.orderStatus}`, marginX, currentY);
  currentY += 7;
  doc.text(`Payment Method: ${order.paymentMethod}`, marginX, currentY);
  currentY += 10;

  // Add coupon details if available
  if (order.coupon) {
    doc.text(`Coupon Code: ${order.coupon.code}`, marginX, currentY);
    currentY += 7;
    doc.text(`Discount Amount: ${order.coupon.discount}`, marginX, currentY);
    currentY += 10;
  }

  // Save the PDF
  doc.save(`Invoice_${order._id}.pdf`);
};


const navigateToHome = () => {
  router.push('/admin/dashboard'); // Navigates to the home page
};

  return (
 <> <Navbar />
 {loading && <Loader />}
    <div className={styles.orderContainermain}>
     
     {/* <div className={styles.ShippingInformation}> 
    <button onClick={navigateToHome} className={styles.arrowButton} >  <FaArrowLeft /></button>
    <div className={styles.ShippingInformationh1}>
     
      <h1>Order ID: <span> {order?._id} </span></h1>
      <h1> User  ID: <span> {order?.user} </span></h1>
      </div>
    </div> */}

    <div className={styles.orderContainer}>
   {order ? (
        <div className={styles.orderDetails}>
        




        <div className={styles.fullContainer} >


        <div className={styles.leftContainer} > 
 
        <div className={styles.productImages}>
        {order.orderItems.length > 0 ? (
          order.orderItems.map((item) => (
            <div key={item.product?._id} className={styles.productCard}>
           
      
              <div className={styles.imageContainer}>
                {item.product?.media && item.product?.media.length > 0 ? (
                 

                  <Image
                  src={item.product?.media[0]} // Display the first image from the media array
                  alt={item.product?.name}
                  className={styles.productImage}
           width={500}
           height={500}
         />


                  
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
              <div className={styles.productDetails}>
             
          <p><strong>Name:</strong> <span>  {item.product?.name.length > 20 
            ? item.product?.name.slice(0, 20) + '...' 
            : item.product?.name}  </span></p>
              <p><strong>Price:</strong> <span> ${item.product?.price.toFixed(2)} </span></p>
              <p><strong>Quantity:</strong><span> {item.quantity} </span></p>
              {/* <p><strong>color:</strong><span> {item.color} </span></p>
              <p><strong>size:</strong><span> {item.size} </span></p>
              <p><strong>Attributes:</strong> {item.selectedAttributes 
              ? Object.entries(item.selectedAttributes).map(([key, value]) =>
               `${key}: ${value}`).join(', ') : 'N/A'}</p> */}
                {item.selectedAttributes?.color && <p><strong>Color:</strong> <span>{item.selectedAttributes.color}</span></p>}
              {item.selectedAttributes?.size && <p><strong>Size:</strong> <span>{item.selectedAttributes.size}</span></p>}
              {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                <p><strong>Attributes:</strong> {Object.entries(item.selectedAttributes).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
              )}
              
              <p><strong>Total:</strong> <span> ${(item.product?.price * item.quantity).toFixed(2)} </span></p>
              <div  className={styles.ViewProduct}> 
              <Link href={`/product/details/${item.product?._id}`}> View Product details</Link>
              </div>
            </div>

      

            </div>
          ))
        ) : (
          <p>No products found for this order.</p>
        )}
     
        </div>
      
    
    
     <div className={styles.buttonContainer}>
    
         <div className={styles.UpdateOrder}>
              <label htmlFor="orderStatus">Update Order Status:</label>
              <select
                id="orderStatus"
                className={styles.selectStatus}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
    </div>
    
     <div className={styles.UpdateOrderbuttons}>
              <button className={styles.button} onClick={updateOrderStatus} disabled={loading}>
                {loading ? 'Updating...' : 'Update Status'}
              </button>
    
              <button className={`${styles.button} ${styles.buttonDelete}`} onClick={deleteOrder}>
                Delete Order
              </button>
              </div>

        </div>


        </div>

        
        <div className={styles.rightContainer} >
         
          <div className={styles.CuponPaymentPrice} >

        
          <div className={styles.couponSection}>
      
        
      {order.coupon && order.coupon.code && order.coupon.discount != null ? (
           <>
           <div className={styles.CuponPaymentPriceDivContainer}  >
            <h3 className={styles.headingshiping}>Applied Coupon</h3>
             <p>Coupon Code: <span>{order.coupon.code}</span></p>
             <p> Discount: <span>{order.coupon.discount}%</span></p>
             </div>

           </>
         ) : (
           <p> <span>No Coupon Applied </span></p>
         )}
         
       
        
          
         {order.orderItems.map((item) => (
           item.coupons && item.coupons.length > 0 && item.coupons[0].code && item.coupons[0].discount != null && (
             <div key={item.product._id}>
             <div className={styles.CuponPaymentPriceDivContainer}  >
               <h3 className={styles.headingshiping}>Product-Specific Coupon</h3>
               <p>Product:  <span>{item.product.name} </span></p>
               <p>Coupon Code:  <span>{item.coupons[0].code}</span></p>
               <p>Discount:  <span>{item.coupons[0].discount}%</span></p>
               </div>
             </div>
           )
         ))}
   
       </div>
       
       
      
       <div className={styles.priceDetails}>

             <h3 className={styles.headingshiping}>Order Summary</h3>
            
             <div className={styles.CuponPaymentPriceDivContainer}  >
             {(() => {
               const { totalPrice, discount, finalPrice } = calculateFinalPrice();
               return (
                 <>
                   <p>Subtotal (before discount): <span>${totalPrice.toFixed(2)}</span></p>
                   {discount > 0 && (
                     <p>Discount:  <span>-${discount.toFixed(2)}</span></p>
                   )}
                   <p>Final Price:  <span>${finalPrice.toFixed(2)}</span></p>
                 </>
               );
             })()}
               </div>

           </div>



         <div className={styles.payment} >     
          <div className={styles.CuponPaymentPriceDivContainer}  >   
       <p>Total Price:  <span>{order.totalPrice}</span></p>
    <p>paymentMethod:  <span>{order.paymentMethod} </span></p> 

      <p className={`${styles.orderStatus} ${getStatusClass(order.orderStatus)}`}>
             Order Status: <span>{order.orderStatus}
         </span>  </p>

</div>
    </div>


        
          </div>

           <div className={styles.ShippingAddressContainer}> 
          {/* Safely accessing shipping address details */}
          <h3 >Shipping Address:</h3>
           <div className={styles.ShippingAddress}> 
          <p>Full Name:  <span>{order.shippingAddress?.fullName}  </span></p>
          <p>Address:  <span> {order.shippingAddress?.address}  </span></p>
          <p>Address2: <span> {order.shippingAddress?.address2}  </span></p>
          <p>City:  <span>{order.shippingAddress?.city}  </span></p>
          <p>Country: <span> {order.shippingAddress?.country}  </span></p>
          <p>Phone:  <span> {order.shippingAddress?.phoneNo}  </span></p>
          <p>landmark:  <span>{order.shippingAddress?.landmark}  </span></p>
          <p>pinCode:  <span>  {order.shippingAddress?.pinCode}  </span></p>
          <p>state:  <span> {order.shippingAddress?.state}  </span> </p>
          </div>
               </div>

             <div className={styles.UpdateOrderbuttons}>
                
              <button className={`${styles.button} ${styles.buttonDelete}`} onClick={() => generatePDF(order)}>
              Download Invoice
              </button>
              </div>

           </div>

          {/* Display product images */}



     </div>

        </div>
      ) : (
        <Loader />
      )}

</div>
    </div>

    </>  
  );
};

export default AdminOrderPage;
