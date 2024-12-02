










// i dont use this i think ok 

// import React, { useState, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import DashboardOverview from './DashboardOverview';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     totalProducts: 0,
//     totalCategories: 0,
//     totalSales: 0,
//     totalVisitors: 0,
//     totalCustomers: 0,
//   });

//   useEffect(() => {
//     // Fetch the dashboard data from your backend API
//     axios.get('/api/admin/dashboardData')
//       .then(response => setDashboardData(response.data))
//       .catch(error => console.error('Error fetching dashboard data:', error));
//   }, []);

//   return (
//     <div className="flex">
//       <Sidebar />
//       <main className="flex-1 p-4">
//         <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
//         <DashboardOverview {...dashboardData} />
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
