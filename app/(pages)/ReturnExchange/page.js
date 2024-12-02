

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
//     }, 500); // Adjust the timeout as necessary

//     return () => clearTimeout(timer); // Cleanup timer on component unmount
//   }, []);
  
//   return (
//     <div className={styles.pageContainer}>
//     {isLoading && <Loader />} 
//     {!isLoading && (
//       <>

//     <h1>Return & Exchange</h1>
    
//     Return & Exchange
//     <p>
// Free Online Returns
// </p>
// <span > 
// To make your holiday shopping easier, were extending our return window. Orders placed on puma.com between November 1st, 2023, and December 25th, 2023 may be returned in their original, unused condition as late as February 8th, 2024. Orders placed after December 25th, 2023 will follow our normal return timeframe of 45 days after purchase.
// </span>



// <p>
// Initiating Your Return
// </p>
// <span > 
// Looking to make a return online? Youre in the right place. Click here to be redirected to our returns portal to initiate a return online.
// </span>



// <p>
// Refunds
// </p>
// <span > 
// Purchases made by debit or credit card and through PayPal will be credited back to the original form of payment. If you paid with a shopping Gift Card, you will be issued a separate E-Gift Card for the refunded amount.
// </span>

// <span > 
// Returns that have been initiated on us.puma.com can take 1-2 weeks to process depending on when the return is received. Please make sure you select the right item(s) you wish to return to avoid delays in refunding.
// </span>

// <span > 
// Please note your financial institutions return processing timelines before reaching out with any concerns regarding your refund.
// </span>





// <p>
// Return Exceptions
// </p>
// <span > 
// shopping does not accept returns on gift cards, customized products, and bodywear including face masks. Custom products are nonrefundable, except in the case of manufacturing or material defects in which case you may contact Customer Service via phone or email for assistance.
// </span>





// <p>
// Returns to shopping Retail Stores
// </p>
// <span > 
// You may return items purchased on puma.com to any shopping store. Please bring the original form of payment and a physical or digital copy of the Order Confirmation Email with you so you may be refunded. Purchases made by credit card will be credited back to that original card (including pre-paid gift cards). If you paid with a shopping Gift Card, Apple Pay, Google Pay, or PayPal, then a shopping Gift Card will be issued with the refunded amount.
// </span>





// <p>
// Exchanges
// </p>
// <span > 
// We do not offer direct exchanges at this time. If you wish to exchange an item, you must go through our return process and place a new order.
// We will provide you with a pre-paid shipping label for your return and your new order will come with free standard shipping.
// </span>

// </>
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";

import DynamicPage from "../DynamicPage";

const ReturnExchange = () => <DynamicPage pageName="ReturnExchange" />;

export default ReturnExchange;

