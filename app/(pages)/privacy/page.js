

"use client";

// import React, { useEffect, useState } from 'react';

// import styles from "../../../styles/InfoPages.module.css";
// import Loader from "../../../components/Loader";



// // pages/privacy.js
// export default function PrivacyPage() {

//   const [isLoading, setIsLoading] = useState(true); // Initialize loading state to true

//   // Simulate loading effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false); // Set loading to false after 2 seconds
//     }, 2000); // Adjust the timeout as necessary

//     return () => clearTimeout(timer); // Cleanup timer on component unmount
//   }, []);

//     return (
//       <div className={styles.pageContainer}>
//       {isLoading && <Loader />} 
//       {!isLoading && (
//         <>
//       <h1> Privacy Policy</h1>

//  <span>   
// This privacy policy describes the personal data collected or generated (processed) when you interact with ShopName through our websites, digital experiences, mobile applications, stores, events, or one of our other products or services, all of which are part of ShopNames Platform (“Platform”). It also explains how your personal data is used, shared and protected, what choices you have relating to your personal data and how you can contact us.
// </span>

// <p>
// WHO is Responsible for the Processing of Your Personal Data?
// </p>

// <span>
// The ShopName entity responsible for the processing of your personal data will depend on how you interact with ShopName’s Platform and where you are located in the world.
// </span>

// <span>
// Please review our List of Local Entities for the name of the ShopName entity responsible and the appropriate contact information.
// </span>

// <p>
// WHAT Personal Data Do We Collect and WHEN?
// </p>

// <span>
// We ask you for certain personal data to provide you with the products or services you request. For example, when you make purchases, contact our consumer services, request to receive communications, create an account, participate in our events or contests, or use our Platform. Additionally, when you request specific services in store, we may ask you to login to provide services that are then associated with your account (e.g. size, fit, preferences).
// </span>

// <p>
// This personal data includes your:
// </p>

// <p>
// - contact details including name, email, telephone number and shipping and billing address;
// </p>
// <span>
// - login and account information, including screen name, password and unique user ID;
// </span>

// <p>

// - personal details including gender, hometown, date of birth and purchase history;
// </p>

// <p>
// - payment or credit card information;
// </p>
// <p>
// - images, photos and videos;
// </p>
// <span>
// - data on physical characteristics, including weight, height, and body measurements (such as estimated stride and shoe/foot measurements or apparel size);
// </span>

// <p>
// - fitness activity data provided by you or generated through our Platform (time, duration, distance, location, calorie count, pace/stride); or
// </p>

// <p>
// - personal preferences including your wish list as well as marketing and cookie preferences.
// </p>

// <span>
// We collect additional personal data from you to enable particular features within our Platform. For example, we request access to your phones location data to log your run route, your contacts to allow you to interact with your friends, your calendar to schedule a training plan or your social network credentials to post content from our Platform to a social network. This personal data includes your:
// </span>

// <p>
// - movement data from your device’s accelerometer;
// </p>

// <span>
// - photos, audio, contacts and calendar information;
// </span>

// <span>
// - sensor data, including heart rate and (GPS) location data; or
// </span>

// <p> 
// - social network information, including credentials and any information from your public posts about Nike or your communications with us.
// </p>

// <span>
// When interacting with our Platform, certain data is automatically collected from your device or web browser. More information about these practices is included in the “Cookies and Pixel Tags” section of this privacy policy below. This data includes:
// </span>


// <p>
// - Device IDs and type, call state, network access, storage information and battery information;
// </p>

// - Traffic data about your visit to and interactions with our Platform, including products you viewed, added to your cart or searched for and whether you are logged-in to your Nike account;

// <p> - Cookies, IP addresses, referrer headers, data identifying your web browser and version, web beacons, tags and interactions with our Platform.
// </p>
// </>
// )}
// </div>
// );
// };


import DynamicPage from "../DynamicPage";

const PrivacyPage = () => <DynamicPage pageName="Privacy" />;

export default PrivacyPage;



