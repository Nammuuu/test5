








// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Link from "next/link";
// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    
//       if (!token) {
//         toast.error("Unauthorized: Please log in as admin.");
//         return;
//       }


//       const response = await axios.get('/api/admin/orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(response.data.orders);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.data.message) {
//         setError(error.response.data.message);
//         toast.error(error.response.data.message);
//       } else {
//         setError("Something went wrong.");
//         toast.error("Something went wrong.");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div>
//       <h2>Admin Orders</h2>
//       {loading ? (
//         <p>Loading orders...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>User</th>
//               <th>Total Price</th>
//               <th>Status</th>
//               <th>Order Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id}>
//               <Link href={`/admin/orders/${order._id}`}>
//                 <td>{order._id}</td>
//                 <td>{order.user.name} ({order.user.email})</td>
//                 <td>{order.totalPrice}</td>
//                 <td>{order.orderStatus}</td>
//                 <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//               </Link>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;





// "use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// import styles from '../../../styles/admin/order/Order.module.css'; // Import the CSS module

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
//       if (!token) {
//         toast.error("Unauthorized: Please log in as admin.");
//         return;
//       }
 
//       const response = await axios.get('/api/admin/orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(response.data.orders);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.data.message) {
//         setError(error.response.data.message);
//         toast.error(error.response.data.message);
//       } else {
//         setError("Something went wrong.");
//         toast.error("Something went wrong.");
//       }
//     }
//   };

//   const handleOrderSelection = (orderId) => {
//     setSelectedOrders((prevSelectedOrders) =>
//       prevSelectedOrders.includes(orderId)
//         ? prevSelectedOrders.filter((id) => id !== orderId)
//         : [...prevSelectedOrders, orderId]
//     );
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         '/api/admin/orders/bulk-delete',
//         { orderIds: selectedOrders },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Selected orders deleted successfully');
//       fetchOrders(); // Refresh order list after deletion
//     } catch (error) {
//       toast.error('Failed to delete orders.');
//     }
//   };

//   const handleStatusUpdate = async (orderId, status) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `/api/admin/orders/${orderId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Order status updated');
//       fetchOrders();
//     } catch (error) {
//       toast.error('Failed to update order status.');
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className={styles.container}>
//       <h2>Admin Orders</h2>
//       {loading ? (
//         <p>Loading orders...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div>
//           <button className={styles.button} onClick={handleBulkDelete} disabled={!selectedOrders.length}>
//             Delete Selected Orders
//           </button>
//           <table className={styles.orderTable}>
//             <thead>
//               <tr>
//                 <th>Select</th>
//                 <th>Order ID</th>
//                 <th>Product Image</th>
                
//                 <th>Status</th>
//                 <th>Status Actions</th>
//                 <th>Order Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedOrders.includes(order._id)}
//                       onChange={() => handleOrderSelection(order._id)}
//                     />
//                   </td>
//                   <td>{order._id}</td>
//                   <td>
//                     {order.product?.media && order.product.media.length > 0 ? (
//                       <img
//                         src={order.product.media[0]} // Assuming the media array contains image URLs
//                         alt="Product Image"
//                         className={styles.productImage}
//                       />
//                     ) : (
//                       <p>No Image</p> // Fallback in case there's no image
//                     )}
//                   </td>

//                   <td>
                   
//                   {order.orderStatus}
//                   </td>
                  
//                   <td>
//                     <select
//                       value={order.orderStatus}
//                       className={styles.select}
//                       onChange={(e) =>
//                         handleStatusUpdate(order._id, e.target.value)

//                       }
//                     >
//                       <option  className={styles.optionpending} value="Pending">Pending</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>

//                   </td>


                   


//                   <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <Link  className={styles.link} href={`/admin/orders/${order._id}`}>
//                       View Details
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;



"use client";

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Link from 'next/link';
// import styles from '../../../styles/admin/order/Order.module.css'; // Import the CSS module

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrders, setSelectedOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
//       if (!token) {
//         toast.error("Unauthorized: Please log in as admin.");
//         return;
//       }

//       const response = await axios.get('/api/admin/orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(response.data.orders);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       if (error.response && error.response.data.message) {
//         setError(error.response.data.message);
//         toast.error(error.response.data.message);
//       } else {
//         setError("Something went wrong.");
//         toast.error("Something went wrong.");
//       }
//     }
//   };

//   const handleOrderSelection = (orderId) => {
//     setSelectedOrders((prevSelectedOrders) =>
//       prevSelectedOrders.includes(orderId)
//         ? prevSelectedOrders.filter((id) => id !== orderId)
//         : [...prevSelectedOrders, orderId]
//     );
//   };

//   const handleBulkDelete = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         '/api/admin/orders/bulk-delete',
//         { orderIds: selectedOrders },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Selected orders deleted successfully');
//       fetchOrders(); // Refresh order list after deletion
//     } catch (error) {
//       toast.error('Failed to delete orders.');
//     }
//   };

//   const handleStatusUpdate = async (orderId, status) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `/api/admin/orders/${orderId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('Order status updated');
//       fetchOrders();
//     } catch (error) {
//       toast.error('Failed to update order status.');
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <div className={styles.container}>
//       <h2>Admin Orders</h2>
//       {loading ? (
//         <p>Loading orders...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div>
//           <button className={styles.button} onClick={handleBulkDelete} disabled={!selectedOrders.length}>
//             Delete Selected Orders
//           </button>
//           <table className={styles.orderTable}>
//             <thead>
//               <tr>
//                 <th>Select</th>
//                 <th>Order ID</th>
//                 <th>Product Image</th>
//                 <th>Status</th>
//                 <th>Status Actions</th>
//                 <th>Order Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order) => (
//                 <tr key={order._id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selectedOrders.includes(order._id)}
//                       onChange={() => handleOrderSelection(order._id)}
//                     />
//                   </td>
//                   <td>{order._id}</td>
//                   <td>
//                     {order.orderItems[0]?.product?.media?.length > 0 ? (
//                       <img
//                         src={order.orderItems[0].product.media[0]} // Access the first image from the media array
//                         alt="Product Image"
//                         className={styles.productImage}
//                       />
//                     ) : (
//                       <p>No Image</p> // Fallback in case there's no image
//                     )}
//                   </td>

//                   <td>{order.orderStatus}</td>
//                   <td>
//                     <select
//                       value={order.orderStatus}
//                       className={styles.select}
//                       onChange={(e) =>
//                         handleStatusUpdate(order._id, e.target.value)
//                       }
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//                   <td>
//                     <Link className={styles.link} href={`/admin/orders/${order._id}`}>
//                       View Details
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;




// pdf add 

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from '../../../styles/admin/order/Order.module.css'; // Import the CSS module
import Image from "next/image";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      if (!token) {
        toast.error("Unauthorized: Please log in as admin.");
        return;
      }

      const response = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("Something went wrong.");
        toast.error("Something went wrong.");
      }
    }
  };

  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prevSelectedOrders) =>
      prevSelectedOrders.includes(orderId)
        ? prevSelectedOrders.filter((id) => id !== orderId)
        : [...prevSelectedOrders, orderId]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/admin/orders/bulk-delete',
        { orderIds: selectedOrders },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Selected orders deleted successfully');
      fetchOrders(); // Refresh order list after deletion
    } catch (error) {
      toast.error('Failed to delete orders.');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status.');
    }
  };


// add product image done ok 
const generatePDF = async (order) => {
  const doc = new jsPDF();

  // Add the title
  doc.text(`Invoice for Order ID: ${order._id}`, 10, 10);

  // Define columns and data for the table
  const columns = [
    { header: 'Product', dataKey: 'productName' },
    { header: 'Quantity', dataKey: 'quantity' },
    { header: 'Price', dataKey: 'price' },
    { header: 'Image', dataKey: 'image' }, // Added Image column
  ];

  // Map order items to data array and fetch images
  const dataPromises = order.orderItems.map(async (item) => {
    const imageUrl = item.product.media[0]; // Use the first image
    let imageDataUrl = '';

    // Fetch the image data
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      imageDataUrl = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }

    return {
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: imageDataUrl, // Add the image data URL
    };
  });

  const data = await Promise.all(dataPromises);

  // Add table with product data
  doc.autoTable({
    columns,
    body: data,
    didDrawCell: (data) => {
      if (data.column.dataKey === 'image') {
        const imgX = data.cell.x + 5;
        const imgY = data.cell.y + 2;
        const imgWidth = 30;
        const imgHeight = 30;

        if (data.cell.raw) {
          doc.addImage(data.cell.raw, 'JPEG', imgX, imgY, imgWidth, imgHeight);
        }
      }
    },
  });

  // Add additional details
  doc.text(`Total Price: ${order.totalPrice}`, 10, doc.lastAutoTable.finalY + 10);

  // Save the PDF
  doc.save(`Invoice_${order._id}.pdf`);
};





// const generatePDF = (order) => {
//   const doc = new jsPDF();
  
//   // Set margin and spacing variables
//   const marginX = 10;
//   let currentY = 10; // Tracks Y position on the PDF for dynamic content placement
  
//   // Add title
//   doc.setFontSize(16);
//   doc.text(`Invoice for Order ID: ${order._id}`, marginX, currentY);
//   currentY += 10;

//   // Add user details
//   doc.setFontSize(12);
//   doc.text(`User Email: ${order.user.email}`, marginX, currentY);
//   currentY += 10;
  
//   // Add shipping address
//   doc.text(`Shipping Address:`, marginX, currentY);
//   currentY += 7;
//   doc.text(`${order.shippingAddress.fullName}`, marginX, currentY);
//   currentY += 7;
//   doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.address2}`, marginX, currentY);
//   currentY += 7;
//   doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, marginX, currentY);
//   currentY += 7;
//   doc.text(`${order.shippingAddress.country}, ${order.shippingAddress.pinCode}`, marginX, currentY);
//   currentY += 10;

//   // Define columns and data for the table
//   const columns = [
//     { header: 'Product', dataKey: 'productName' },
//     { header: 'Quantity', dataKey: 'quantity' },
//     { header: 'Price', dataKey: 'price' },
//     { header: 'Product Image', dataKey: 'productImage' }, // Image column
//   ];
  
//   // const data = order.orderItems.map((item) => ({
//   //   productName: item.product.name,
//   //   quantity: item.quantity,
//   //   price: item.product.price,
//   //   productImage: item.product.media.length > 0 ? item.product.media[0] : '', // Ensure image URL or empty string
//   // }));

//   const data = order.orderItems.map((item) => ({
//     productName: item.product?.name || 'N/A', // Fallback to 'N/A' if product or name is unavailable
//     quantity: item.quantity,
//     price: item.product?.price || 'N/A', // Fallback for price
//     productImage: item.product?.media?.[0] || '', // Ensure fallback for image URL
//   }));
  

//   // Add product table
//   doc.autoTable({
//     head: [columns],
//     body: data.map(row => [
//       row.productName,
//       row.quantity,
//       row.price,
//       row.productImage ? { content: '', styles: { cellWidth: 30, minCellHeight: 30 } } : '' // Handle image cell or empty
//     ]),
//     startY: currentY,
//     theme: 'grid',
//     styles: { fontSize: 10, cellPadding: 3 },
//     columnStyles: {
//       0: { cellWidth: 60 }, // Product name
//       1: { cellWidth: 30 }, // Quantity
//       2: { cellWidth: 30 }, // Price
//       3: { cellWidth: 40 }  // Image placeholder
//     },
//     didDrawCell: (data) => {
//       if (data.column.dataKey === 3 && data.cell.section === 'body') {
//         const imgUrl = data.row.raw[3];
//         if (imgUrl) {
//           const img = new Image();
//           img.src = imgUrl;
//           img.onload = () => {
//             doc.addImage(img, 'JPEG', data.cell.x + 2, data.cell.y + 2, 30, 30);
//           };
//         }
//       }
//     }
//   });

//   // Update Y position after table
//   currentY = doc.lastAutoTable.finalY + 10;

//   // Add additional order details
//   doc.text(`Total Price: ${order.totalPrice}`, marginX, currentY);
//   currentY += 7;
//   doc.text(`Order Status: ${order.orderStatus}`, marginX, currentY);
//   currentY += 7;
//   doc.text(`Payment Method: ${order.paymentMethod}`, marginX, currentY);
//   currentY += 10;

//   // Add coupon details if available
//   if (order.coupon) {
//     doc.text(`Coupon Code: ${order.coupon.code}`, marginX, currentY);
//     currentY += 7;
//     doc.text(`Discount Amount: ${order.coupon.discount}`, marginX, currentY);
//     currentY += 10;
//   }

//   // Save the PDF
//   doc.save(`Invoice_${order._id}.pdf`);
// };


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
     
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>

        <div className={styles.headingContainer}>
        <h2>Admin Orders</h2>
          <button className={styles.button} onClick={handleBulkDelete} disabled={!selectedOrders.length}>
            Delete Selected Orders
          </button>
          </div>

          <div className={styles.tableContainer}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Select</th>
                <th>Order ID</th>
                <th>Product Image</th>
                <th>Status</th>
                <th>Status Actions</th>
                <th>Order Date</th>
                <th>Invoice</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleOrderSelection(order._id)}
                    />
                  </td>
                  
                  <td>{order._id.slice(0, 8)}...</td>
                  <td>
                    {order.orderItems[0]?.product?.media?.length > 0 ? (
                      <Image
                      src={order.orderItems[0].product.media[0]} // Access the first image from the media array
                        alt="Product Image"
                        className={styles.productImage}
               width={900}
               height={900}
             />
           
                    ) : (
                      <p>No Image</p> // Fallback in case there's no image
                    )}
                  </td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <select
                      value={order.orderStatus}
                      className={styles.select}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => generatePDF(order)}>Download Invoice</button>
                  </td>
                  <td>
                    <Link className={styles.link} href={`/admin/orders/${order._id}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
