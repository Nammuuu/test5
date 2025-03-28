
// pdf add 
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import styles from '../../../styles/admin/order/Order.module.css'; // Import the CSS module
import Image from "next/image";
import Loader from "../../../components/Loader";
import ReactPaginate from 'react-paginate';
import {
  FaStar, FaSearch, FaBars, FaTimes, FaTag, FaFilter,
  FaSortAmountUp, FaSortAmountDown, FaHeart, FaEye, FaShoppingCart,
  FaArrowLeft, FaArrowRight
} from 'react-icons/fa';
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import QRCode from "qrcode";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [logoUrl, setLogoUrl] = useState(null);
  const [formData, setFormData] = useState({
   
    themeColor: "#ffffff", 
    shopName: "",
    website: "",
    font: "Poppins", 
    address: "",
    postCode: "",
    contact: "",
    email: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",

  });

  
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
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  

  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     try {
  //       const res = await axios.get("/api/admin/setting" , {
  //         headers: {
  //           'Cache-Control': 'no-cache',
  //         },
  //       });
  //       if (res?.data) {
  //         setFormData(res.data);  // Ensure you update the formData with the correct settings
        
         
  //       }
  //     } catch (error) {
  //       console.error("Failed to load settings:", error);
  //     }
  //   };
  
  //   fetchSettings();
  // }, []);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/setting", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (res?.data) {
          setFormData(res.data);
          console.log("Fetched formData:", res.data); // Debugging
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
  
    fetchSettings();
  }, []);

  
  // for logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
          const response = await axios.get("/api/admin/setting/logoclint", {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        setLogoUrl(response.data.themeSettings.loginlogo);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to load logo.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogo();
  }, []);

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

//   const data = order.orderItems.map((item) => {
//     const attributes = item.attributes ? item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ') : 'N/A';
    
//     return {
//       productName: item.product?.name || 'N/A',
//       quantity: item.quantity || 0,
//       price: item.product?.price || 'N/A',
//       size: item.size || 'N/A',
//       color: item.color || 'N/A',
//       attributes, // Add attributes field
//     };
//   });
  
//   // Update columns
//   const columns = [
//     { header: 'Product', dataKey: 'productName' },
//     { header: 'Quantity', dataKey: 'quantity' },
//     { header: 'Size', dataKey: 'size' },
//     { header: 'Color', dataKey: 'color' },
//     { header: 'Attributes', dataKey: 'attributes' }, // New column for attributes
//     { header: 'Price', dataKey: 'price' },
//   ];
  
//   // Update autoTable body mapping
//   doc.autoTable({
//     head: [columns.map(col => col.header)],
//     body: data.map(row => [
//       row.productName,
//       row.quantity,
//       row.size,
//       row.color,
//       row.attributes, // Include attributes in the table
//       row.price,
//     ]),
//     startY: currentY,
//     theme: 'grid',
//     styles: { fontSize: 10, cellPadding: 3 },
//     columnStyles: {
//       0: { cellWidth: 50 }, // Product name
//       1: { cellWidth: 20 }, // Quantity
//       2: { cellWidth: 20 }, // Size
//       3: { cellWidth: 20 }, // Color
//       4: { cellWidth: 50 }, // Attributes
//       5: { cellWidth: 30 }, // Price
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




const generatePDF = async (order, formData, logoUrl) => {
  const doc = new jsPDF();
  console.log("PDF function formData:", formData); // Debugging

  const marginX = 10;
  let currentY = 20; // Start position for content

  // Add Company Logo
  if (logoUrl) {
    try {
      const img = new Image();
      img.src = logoUrl;
      doc.addImage(img, "PNG", marginX, 5, 40, 20); // Position logo at top
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  }

  // Title
  doc.setFontSize(16);
  doc.text(`Invoice for Order ID: ${order._id}`, marginX, currentY);
  currentY += 10;

  // Company Details
  // doc.setFontSize(12);

  if (formData.shopName) {
    console.log("shopName exists:", formData.shopName); // Debugging
  } else {
    console.log("shopName is missing in PDF function"); // Debugging
  }

  doc.setFontSize(12);
  if (formData.shopName) {
    doc.text(`Shop Name: ${formData.shopName}`, marginX, currentY);
    currentY += 7;
  }

  
  if (formData.address) doc.text(`Address: ${formData.address}`, marginX, currentY);
  currentY += 7;
  if (formData.contact) doc.text(`Phone: ${formData.contact}`, marginX, currentY);
  currentY += 7;
  if (formData.email) doc.text(`Email: ${formData.email}`, marginX, currentY);
  currentY += 10;

  // Customer & Shipping Details
  doc.text(`Customer: ${order.user.email}`, marginX, currentY);
  currentY += 10;
  doc.text(`Shipping Address:`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.fullName}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.address}, ${order.shippingAddress.address2 || ""}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`, marginX, currentY);
  currentY += 7;
  doc.text(`${order.shippingAddress.country}, ${order.shippingAddress.pinCode}`, marginX, currentY);
  currentY += 10;

  // Order Items Table
  const data = order.orderItems.map((item) => {
    const attributes = item.attributes ? item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(', ') : null;
    
    return [
      item.product?.name || 'N/A',
      item.quantity || 0,
      item.size || null,
      item.color || null,
      attributes || null,
      item.product?.price || 'N/A',
    ].filter(Boolean); // Remove null values
  });

  const columns = ["Product", "Quantity", "Size", "Color", "Attributes", "Price"].filter((col, index) =>
    data.some(row => row[index] !== null) // Show only if any row has data
  );

  doc.autoTable({
    head: [columns],
    body: data,
    startY: currentY,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 50 } },
  });

  currentY = doc.lastAutoTable.finalY + 10;

  // Additional Order Details
  doc.text(`Total Price: ${order.totalPrice}`, marginX, currentY);
  currentY += 7;
  doc.text(`Order Status: ${order.orderStatus}`, marginX, currentY);
  currentY += 7;
  doc.text(`Payment Method: ${order.paymentMethod}`, marginX, currentY);
  currentY += 10;

  // Coupon Details (if available)
  if (order.coupon) {
    doc.text(`Coupon Code: ${order.coupon.code}`, marginX, currentY);
    currentY += 7;
    doc.text(`Discount: ${order.coupon.discount}`, marginX, currentY);
    currentY += 10;
  }

  // Generate QR Code for Order Details
  // try {
  //   const qrData = await QRCode.toDataURL(`https://www.mydomain.com/product/order/${order._id}`);
  //   doc.addImage(qrData, "PNG", marginX, currentY, 40, 40);
  //   currentY += 50;
  // } catch (error) {
  //   console.error("Error generating QR Code:", error);
  // }

  // Footer Line
  doc.line(10, 280, 200, 280);

  // Save the PDF
  doc.save(`Invoice_${order._id}.pdf`);
};


const offset = currentPage * itemsPerPage;
const currentOrders = orders.slice(offset, offset + itemsPerPage);


  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
   

    <div className={styles.container}>
     
     {loading && <Loader />}

      {loading ? (
       <Loader />
        
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
              {/* {orders.map((order) => ( */}
              {currentOrders.map((order) => (
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

<ReactPaginate
  previousLabel={<FaArrowLeft />}
  nextLabel={<FaArrowRight />}
  pageCount={Math.ceil(orders.length / itemsPerPage)}
  onPageChange={handlePageClick}
  containerClassName={styles.pagination}
  activeClassName={styles.active}
  pageLinkClassName={styles.page_link}
  previousLinkClassName={styles.prev_link}
  nextLinkClassName={styles.next_link}
/>


    </div>
  );
};

export default AdminOrders;
