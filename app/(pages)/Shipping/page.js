



"use client";

// import React, { useEffect, useState } from 'react';

// import styles from "../../../styles/InfoPages.module.css";
// import Loader from "../../../components/Loader";

// const Page = () => {
//   const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

//   // Simulate loading effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false); // Set loading to false after 2 seconds
//     }, 2000); // Adjust the timeout as necessary

//     return () => clearTimeout(timer); // Cleanup timer on component unmount
//   }, []);

//   return (
//     <div className={styles.pageContainer}>
//     {isLoading && <Loader />} 
//     {!isLoading && (
//       <>

//         <h1> Shipping</h1>    
//     </>
//   )}
// </div>
// );
// };

// export default Page;


import DynamicPage from "../DynamicPage";

const Shipping = () => <DynamicPage pageName="Shipping" />;

export default Shipping;

