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
import Loader from "../../../components/Loader"

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    returned: 0,
canceledOrders: 0,
    Processing: 0,
    orders: { data: [], totalPages: 1, currentPage: 1 },
  });

  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found in localStorage");
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/admin/dashboard/dashboardData/orderdata`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        const data = response.data;
        // Map backend response to frontend structure
        const mappedOrderData = {
          totalOrders: data.totalOrders || 0,
          confirmedOrders: data.confirmedOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          Processing: data.Processing || 0,        
          deliveredOrders: data.deliveredOrders || 0,
          canceledOrders: data.canceledOrders || 0,
          returned: data.canceledOrders || 0,
          returnedOrders: data.canceledOrders || 0,
          orders: data.orders || { data: [], totalPages: 1, currentPage: 1 },
        };
  
        setOrderData(mappedOrderData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  

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
       
    

        setDashboardData({
          ...data,
          totalViewsCount: allViewsCount,  // Set the calculated total views
        });
        setStockAlerts(alerts);
        setTotalPages(data.users.totalPages); 
        
        // setOrderData((prev) => ({ ...prev, orders: response.data.orders }));

        // setOrderData(response.data);

        // setOrderData(
        //   ...data,
        //   orderSummary);


        
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

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    // setFilter(selectedStatus);
    fetchFilteredOrders(selectedStatus);
  };

  if (loading) return <Loader />;

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

{/* <OrderStatistics {...orderData} />
    */}

        

            {/* <Graph chartData={[dashboardData.totalUsers, dashboardData.totalProducts, dashboardData.totalOrders, dashboardData.totalCategories, dashboardData.totalViewsCount]} /> */}
            <Graph chartData={[dashboardData.totalUsers,
             dashboardData.totalProducts,
            dashboardData.totalOrders,
            dashboardData.totalCategories, ]} />
           
           <Product />
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

  if (loading) return <Loader />; 

  return (
    <div className={`${styles.dashboardContainer} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} setCurrentSection={setCurrentSection} />
      <main className={`${styles.mainContent} ${isSidebarOpen ? styles.contentShiftRight : styles.contentShiftLeft}`}>
       
        {renderSection()}
      </main>
    </div>
  )
};

export default AdminDashboard;



