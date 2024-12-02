


// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from "./Sidebar";
// import DashboardOverview from "./DashboardOverview";
// import TableWithPagination from "./TableWithPagination";
// import Graph from "./Graph";
// import Product from "../product/product";
// import Settings from "../settings/page";
// import Orders from "../orders/page";
// import Categories from "../Categories";
// // import Users from "../product/users";
// import styles from "../../../styles/admin/AdminAll.module.css";

// const AdminDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [currentSection, setCurrentSection] = useState('Dashboard'); // State to track the current section

//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     totalProducts: 0,
//     totalCategories: 0,
//     totalSales: 0,
//     totalCustomers: 0,
//     totalUsers: 0,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`/api/admin/dashboard/dashboardData?page=${currentPage}&limit=10`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setDashboardData(response.data);
//         setTotalPages(response.data.users.totalPages);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const renderSection = () => {
//     switch (currentSection) {
//       case 'Dashboard':
//         return (
//           <>
//             <DashboardOverview {...dashboardData} />
//             <Graph chartData={[dashboardData.totalUsers, dashboardData.totalProducts, dashboardData.totalOrders, dashboardData.totalCategories]} />
//             <TableWithPagination
//               data={dashboardData.users.data}
//               totalPages={totalPages}
//               currentPage={currentPage}
//               onPageChange={handlePageChange}
//             />
//           </>
//         );
//       case 'Products':
//         return <Product />;
//       case 'Orders':
//         return <Orders />;
//       case 'Categories':
//         return <Categories />;
//       case 'Settings':
//         return <Settings />;
//       default:
//         return <DashboardOverview {...dashboardData} />;
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className={`${styles.dashboardContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setCurrentSection={setCurrentSection} />
//       <main className={`${styles.mainContent} ${isSidebarOpen ? styles.contentShiftRight : styles.contentShiftLeft}`}>
//         <h1 className={styles.pageTitle}>Admin Dashboard</h1>
//         {renderSection()}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;





// "use client";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Sidebar from "./Sidebar";
// import DashboardOverview from "./DashboardOverview";
// import TableWithPagination from "./TableWithPagination";
// import Graph from "./Graph";
// import Product from "../product/product";
// import Settings from "../settings/page";
// import Orders from "../orders/page";
// import Categories from "../Categories";
// import styles from "../../../styles/admin/AdminAll.module.css";

// const AdminDashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [currentSection, setCurrentSection] = useState('Dashboard'); 

//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     totalProducts: 0,
//     totalCategories: 0,
//     totalSales: 0,
//    totalViewsCount: 0,
//     totalSalesCount: 0,
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.get(`/api/admin/dashboard/dashboardData?page=${currentPage}&limit=10`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
        
//         setDashboardData(response.data);
//         setTotalPages(response.data.users.totalPages); // Example: Total Pages for Users
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const renderSection = () => {
//     switch (currentSection) {
//       case 'Dashboard':
//         return (
//           <>
//             <DashboardOverview
//             totalViewsCount={dashboardData.totalViewsCount}  // Passing totalViewsCount
//             totalSalesCount={dashboardData.totalSalesCount}
           
//             {...dashboardData} />
//             <Graph chartData={[dashboardData.totalUsers, dashboardData.totalProducts, dashboardData.totalOrders, dashboardData.totalCategories]} />
//             <TableWithPagination
//               data={dashboardData.users.data}
//               totalPages={totalPages}
//               currentPage={currentPage}
//               onPageChange={handlePageChange}
//             />
//           </>
//         );
//       case 'Products':
//         return <Product />;
//       case 'Orders':
//         return <Orders />;
//       case 'Categories':
//         return <Categories />;
//       case 'Settings':
//         return <Settings />;
//       default:
//         return <DashboardOverview {...dashboardData} />;
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className={`${styles.dashboardContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setCurrentSection={setCurrentSection} />
//       <main className={`${styles.mainContent} ${isSidebarOpen ? styles.contentShiftRight : styles.contentShiftLeft}`}>
//         <h1 className={styles.pageTitle}>Admin Dashboard</h1>
//         {renderSection()}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;


"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import TableWithPagination from "./TableWithPagination";
import Graph from "./Graph";
import Product from "../product/product";
import Settings from "../settings/page";
import Orders from "../orders/page";
import Categories from "../Categories";
import styles from "../../../styles/admin/AdminAll.module.css";
import UserListPage from "../users/page"
import Blog from '../blog/page';
import BlogList from "../blog/get/page"
// import Banner from "./banner/page"
import Chat from "../components/components/Chat"
import Pagesettings from "../pagesetting/page"
import Components from "../components/components/Components"

import ReviewsAdminPanel from "../components/components/Review"
import PageEditor from "../components/components/PageData"

import OrderStatistics from "./adminhome/OrderStatistics";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('Dashboard'); 
  const [stockAlerts, setStockAlerts] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalSales: 0,
    totalUsers: 0,
    totalViewsCount: 0,
    totalSalesCount: 0,
    stockAlerts: 0,
  });

const [orderData, setOrderData] = useState({
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    ongoing: 0,
    delivered: 0,
    canceled: 0,
    returned: 0,
    rejected: 0,
  });



  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/admin/dashboard/dashboardData?page=${currentPage}&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = response.data;
     

      // Admin Name
      // const admin = data.find(user => user.role === "admin");
      // // if (admin) {
      // //   setAdminName(admin.username); // Set the admin's username
      // // }
      if (data.admin && data.admin.username) {
        setAdminName(data.admin.username);
      }

      const alerts = data.products.data.reduce((acc, product) => {
        if (product.stock === 0) acc.push({ ...product, alertType: 'Out of Stock' });
        else if (product.stock <= 10) acc.push({ ...product, alertType: 'Low Stock' });
        return acc;
      }, []);
      
        const allViewsCount = data.products.data.reduce((acc, product) => acc + (product.viewsCount || 0), 0); // Calculate total views
         // Aggregate order status counts
        const orders = data.data || [];
        const orderSummary = orders.reduce(
          (acc, order) => {
            acc.totalOrders++;
            switch (order.orderStatus) {
              case "Pending":
                acc.pending++;
                break;
              case "Confirmed":
                acc.confirmed++;
                break;
              case "Processing":
                acc.ongoing++;
                break;
              case "Delivered":
                acc.delivered++;
                break;
              case "Canceled":
                acc.canceled++;
                break;
              case "Returned":
                acc.returned++;
                break;
              case "Rejected":
                acc.rejected++;
                break;
              default:
                break;
            }
            return acc;
          },
          {
            totalOrders: 0,
            pending: 0,
            confirmed: 0,
            ongoing: 0,
            delivered: 0,
            canceled: 0,
            returned: 0,
            rejected: 0,
          }
        );

        setDashboardData({
          ...data,
          totalViewsCount: allViewsCount,  // Set the calculated total views
        });
        setStockAlerts(alerts);
        setTotalPages(data.users.totalPages); 
        setOrderData(
          ...data,
          orderSummary);
        setLoading(false);
         
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'Dashboard':
        return (
          <>
            <DashboardOverview
              totalSales={dashboardData.totalSales}
              totalUsers={dashboardData.totalUsers}
              // totalViewsCount={dashboardData.totalViewsCount}  // Passing calculated totalViewsCount
              totalSalesCount={dashboardData.totalSalesCount}
              totalOrders={dashboardData.totalOrders}
              totalProducts={dashboardData.totalProducts}
              totalCategories={dashboardData.totalCategories}
              stockAlerts={stockAlerts} 
              adminName={adminName}

            />

<OrderStatistics 
totalOrders={orderData.totalOrders}
    {...orderData} />


            {/* <Graph chartData={[dashboardData.totalUsers, dashboardData.totalProducts, dashboardData.totalOrders, dashboardData.totalCategories, dashboardData.totalViewsCount]} /> */}
            <Graph chartData={[dashboardData.totalUsers,
             dashboardData.totalProducts,
            dashboardData.totalOrders,
            dashboardData.totalCategories, ]} />
           
          </>
        );
      case 'Products':
        return <Product />;
      case 'Orders':
        return <Orders />;
      case 'Categories':
        return <Categories />;
        case 'Blog':
          return <> 
          <Blog />
          <BlogList /> 
          </>;
      case 'Settings':
        return <Settings />;

        case 'Chat':
          return <Chat />;
  

        case 'Users':
          return <> 
         <UserListPage />
        </>;

      

       

        case 'Components':
          return <Components />;

          case 'Reviews':
          return  <ReviewsAdminPanel />;
          
          case 'Home':
            return <Pagesettings />;

        case 'Pages':
          return <PageEditor />;

        

      default:


        return <DashboardOverview {...dashboardData} />;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className={`${styles.dashboardContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setCurrentSection={setCurrentSection} />
      <main className={`${styles.mainContent} ${isSidebarOpen ? styles.contentShiftRight : styles.contentShiftLeft}`}>
       
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;
