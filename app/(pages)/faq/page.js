

"use client";

// import React, { useEffect, useState } from 'react';
// import styles from "../../../styles/InfoPages.module.css";
// import Loader from "../../../components/Loader";

// const Page = () => {
//     const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

//     // Simulate loading effect
//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setIsLoading(false); // Set loading to false after 2 seconds
//       }, 2000); // Adjust the timeout as necessary
  
//       return () => clearTimeout(timer); // Cleanup timer on component unmount
//     }, []);

    
//   return (
//     <div className={styles.pageContainer}>
//     {isLoading && <Loader />} 
//     {!isLoading && (
//       <>

//     <h1>Frequently Asked Questions</h1>
//     <p> How do I check my order status? </p>
//     <span>
//         To check the status of your order, including processing and shipping updates. You can check your order status by logging in to your My Account or by entering your order number, email address, and billing zip code. Please note, that once your order has shipped, you will receive an email with a tracking number for all shipping and delivery updates.
//          </span>

//     <p> Can I change or cancel my order once it has been placed? </p>
    
//     <span>
//         Unfortunately, no. Once your order has been placed it is sent to our warehouse for processing. You will need to return the original package to obtain a refund.
//     </span>

//     <p> Visit our Returns & Exchanges page for more information. </p>
//     <p> How do I return or exchange an item? </p>
//     <span>
//         We are happy to offer free online returns for orders placed on puma.com within 45 days of purchase. You may return your Shopping products in their original, unused condition for a full refund.
//     </span>

//     <span>
//         To get started with your return and print your pre-paid shipping label, click here and enter your order number and email address. From there, you will see if you qualify for free returns and find step-by-step instructions to initiate.
//     </span>

//     <span>
//         At this time, we do not offer direct exchanges. To exchange an item, you must return the original item and place a new order. Visit our Returns & Exchanges page for more information and assistance.
//     </span>
//     <p>What is the 30-Day Test Run?</p>
//     <span>
//         Try our running shoes for 30 days and if theyre not a good fit, send them back hassle-free.

//         To start your free return and for step-by-step instructions, visit our Returns & Exchanges page.
//     </span>

//     <p>What types of payments are accepted?</p>
//     <span>
//         We accept payment by debit/credit cards, Apple Pay, PayPal, and Shopping Gift Cards. Visit our Payment Options page for more information.
//     </span>

//     <p>How do I use a promotion/coupon code?</p>
//     <span>
//         To use your promotion or coupon code, enter the code at checkout in the appropriate field. Make sure you enter the code with the exact spelling and capitalization as shown. You must click apply for the discount to be applied. The discounted amount will be displayed on the Shopping Bag and Order Summary pages. If the code is invalid, expired or you have not placed the correct products in the shopping bag, the discount will not be applied.
//     </span>

//     <p>Please refer to our Terms and Conditions for more information.</p>

//     <p>Why Is My Coupon Code Not Working?</p>
//     <span>
//         Our offer codes exclude but are not limited to new product releases, select Classic styles, select Teamsport styles, Golf, Basketball, select RS Products, clearance merchandise, and new licensed and replica jerseys. Offers cannot be combined with any other shipping promotion, offer, or coupon. Offers cannot be applied to past purchases, redeemed for cash equivalent, used to purchase gift cards, or used as payment on an account.
//     </span>

//     </>
//   )}
// </div>
// );
// };

// export default Page;    


import DynamicPage from "../DynamicPage";

const FAQPage = () => <DynamicPage pageName="FAQ" />;

export default FAQPage;



