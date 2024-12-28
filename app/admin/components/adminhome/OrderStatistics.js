



// "use client";

// import React from "react";
// import styles from "./OrderStatistics.module.css";
// import { FaShoppingCart, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaUndo, FaTruck, FaBox } from "react-icons/fa";
 
// const OrderStatistics = ({
//   totalOrders,
//   pendingOrders,
//   confirmedOrders,
//   ongoingOrders,
//   deliveredOrders,
//   canceledOrders,
//   returnedOrders,
//   rejectedOrders,
// }) => {
//   const stats = [
//     { title: "Total Orders", value: totalOrders, icon: <FaShoppingCart />, color: "#007bff", bg: "#fff" },
//     { title: "Pending Orders", value: pendingOrders, icon: <FaHourglassHalf />, color: "#ffc107", bg: "#fff" },
//     { title: "Confirmed Orders", value: confirmedOrders, icon: <FaCheckCircle />, color: "#28a745", bg: "#fff" },
//     { title: "Ongoing Orders", value: ongoingOrders, icon: <FaTruck />, color: "#17a2b8", bg: "#fff" },
//     { title: "Delivered Orders", value: deliveredOrders, icon: <FaBox />, color: "#6c757d", bg: "#fff" },
//     { title: "Canceled Orders", value: canceledOrders, icon: <FaTimesCircle />, color: "#dc3545", bg: "#fff" },
//     { title: "Returned Orders", value: returnedOrders, icon: <FaUndo />, color: "#fd7e14", bg: "#fff" },
//     { title: "Rejected Orders", value: rejectedOrders, icon: <FaTimesCircle />, color: "#343a40", bg: "#fff" },
//   ];

//   return (
//     <div className={styles.statisticsContainer}>
//       <h2 className={styles.header}>Order Statistics</h2>
//       <div className={styles.statisticsGrid}>
//         {stats.map((stat, index) => (
//           <div key={index} className={styles.card} style={{ borderTop: `0px solid ${stat.color}` }}>
//             <div className={styles.iconContainer} style={{ backgroundColor: stat.color,  color: stat.bg  }}>
//               {stat.icon}
//             </div>
            
//             <div className={styles.cardContent}>
//               <h3 className={styles.cardTitle}>{stat.title}</h3>
//               <p className={styles.cardValue}>{stat.value}</p>
//             </div>


            


//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderStatistics;



"use client";

import React from "react";
import styles from "./OrderStatistics.module.css";
import {
  FaShoppingCart,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
  FaTruck,
  FaBox,
} from "react-icons/fa";

const OrderStatistics = ({
  totalOrders,
  pendingOrders,
  confirmedOrders,
  ongoingOrders,
  deliveredOrders,
  canceledOrders,
  returnedOrders,
  rejectedOrders,
}) => {
  const stats = [
    { title: "Total Orders", value: totalOrders, icon: <FaShoppingCart />, color: "#007bff" },
    { title: "Pending Orders", value: pendingOrders, icon: <FaHourglassHalf />, color: "#ffc107" },
    { title: "Confirmed Orders", value: confirmedOrders, icon: <FaCheckCircle />, color: "#28a745" },
    { title: "Ongoing Orders", value: ongoingOrders, icon: <FaTruck />, color: "#17a2b8" },
    { title: "Delivered Orders", value: deliveredOrders, icon: <FaBox />, color: "#6c757d" },
    { title: "Canceled Orders", value: canceledOrders, icon: <FaTimesCircle />, color: "#dc3545" },
    { title: "Returned Orders", value: returnedOrders, icon: <FaUndo />, color: "#fd7e14" },
    { title: "Rejected Orders", value: rejectedOrders, icon: <FaTimesCircle />, color: "#343a40" },
  ];

  return (
    <div className={styles.statisticsContainer}>
      <h2 className={styles.header}>Order Statistics</h2>
      <div className={styles.statisticsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.card} style={{ borderTopColor: stat.color }}>
            <div className={styles.iconContainer} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{stat.title}</h3>
              <p className={styles.cardValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatistics;
