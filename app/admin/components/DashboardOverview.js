



"use client";

import React from "react";
import styles from "../../../styles/admin/DashboardOverview.module.css";
import { FaShoppingCart, FaBoxOpen, FaTags, FaDollarSign, FaUsers, FaEye, FaExclamationTriangle } from "react-icons/fa";


const DashboardOverview = ({ 
  // totalOrders, totalProducts, totalCategories,
  //  totalSales, totalUsers,  totalViewsCount

  totalOrders, 
  totalProducts, 
  totalCategories, 
  totalSales, 
  totalUsers, 
  // totalViewsCount, 
  totalSalesCount, // Accept totalSalesCount
  stockAlerts, // Accept stockAlerts
  adminName
}) => {

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good Morning, ${adminName}`;
    if (hour < 18) return `Good Afternoon, ${adminName}`;
    return `Good Evening, ${adminName}`;
  };

  const stats = [
    { title: "Total Earnings", value: `$${totalSales}`, icon: <FaDollarSign />, color: "#ff0166", description: "Total sales revenue" },
    { title: "Total Orders", value: totalOrders, icon: <FaShoppingCart />, color: "#f23e14", description: "Number of orders placed" },
    { title: "Total Products", value: totalProducts, icon: <FaBoxOpen />, color: "#6a45fe", description: "Products currently available" },
    { title: "Total Customers", value: totalUsers, icon: <FaUsers />, color: "#7d11e9", description: "Registered customers" },
    // { title: "Total Categories", value: totalCategories, icon: <FaTags />, color: "#9C27B0", description: "Product categories listed" },
    // { title: "Total Views Count", value: totalViewsCount, icon: <FaEye />, color: "#009688", description: "Total product views" }, // Use totalViewsCount

  ];

  const [selectedProduct, setSelectedProduct] = React.useState(null);

const handleDetailsClick = (product) => {
  setSelectedProduct(product);
};

const handleClosePopup = () => {
  setSelectedProduct(null);
};





return (

  <> 
  <div className={styles.overviewcontainer}>
  <div className={styles.greeting}>
  <h2>{getGreetingMessage()}</h2>
</div>
<div className={styles.orderview}> <h1> Overview </h1> </div> 
  <div className={styles.dashboardContainer}>

  
    {stats.map((stat, index) => (
      <div key={index} className={styles.card} style={{ backgroundColor: stat.color}}>
        <div className={styles.iconContainer} style={{  color: stat.color }}>
          {stat.icon}
        </div>
        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{stat.title}</h3>
          <p className={styles.cardValue}>{stat.value}</p>
          {/* <p className={styles.cardDescription}>{stat.description}</p> */}
        </div>
      </div>
    ))}

    {/* Stock Alerts Section */}
    <div className={styles.stockAlertsContainer}>
     
      {stockAlerts?.map((product, index) => (
        <div 
          key={index} 
          className={styles.stockAlert} 
          style={{ borderLeft: `5px solid ${product.alertType === 'Out of Stock' ? '#FF5252' : '#FFEB3B'}` }}
        >
          <div className={styles.iconContainer} style={{ backgroundColor: product.alertType === 'Out of Stock' ? '#FF5252' : '#FFEB3B' }}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>Stock Alerts</h3>
            <p className={styles.cardValue}>{product.name}</p>
            <p className={styles.cardDescription}>{product.alertType}</p>
            <button onClick={() => handleDetailsClick(product)}>Details</button>
          </div>
        </div>
      ))}
    </div>

    {/* Popup */}
    {selectedProduct && (
      <div className={styles.popupOverlay} onClick={handleClosePopup}>
        <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
          <h2>Product Details</h2>
          <p><strong>Name:</strong> {selectedProduct.name}</p>
          <p><strong>Stock:</strong> {selectedProduct.stock}</p>
          <p><strong>Alert Type:</strong> {selectedProduct.alertType}</p>
          <button onClick={handleClosePopup}>Close</button>
        </div>
      </div>
    )}
  </div>
  </div>
  </>
);

};

export default DashboardOverview;
