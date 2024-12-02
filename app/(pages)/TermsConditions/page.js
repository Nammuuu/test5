

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

//         <h1> Terms & Conditions</h1>
    
//  <p>
// PLEASE READ THESE TERMS OF USE (“TERMS”) CAREFULLY BEFORE USING ANY ShopName PLATFORM.
// </p>

// <span>
// If you live in any of the following countries or regions, additional terms may apply to you and are viewable at the bottom of these Terms. We display the country/region within the Terms when applicable. These additional terms override the Terms below to the extent of any inconsistency.
// </span>

// <p>
// Argentina, Australia, Brazil, Canada, Colombia, Hong Kong, Japan, Korea, Philippines, all European countries (including specific terms for Austria, Belgium, France, Germany, Hungary, Italy, Poland and Switzerland.
//     </p>

//     <span>
// Welcome to the ShopName community! You are reading these Terms because you are using a ShopName website, digital experience, social media platform, mobile app, wearable technology, or one of our other products or services, all of which are part of ShopName’s Platform (“Platform”). You may access the Platform through a computer, mobile phone, tablet, console or other technology, which we refer to here as a “Device”. Your service provider’s normal rates and fees apply to your Device.

// </span>

// <p>
// These Terms create a legally binding agreement between you and ShopName and its affiliates regarding your use of the Platform. Please review our List of Local Entities for the name of the ShopName entity responsible for providing the Platform to you and the appropriate contact information. A few important points:

// </p>

// <span>
// Our Terms May Change. Some jurisdictions do not permit unilateral updates or changes to consumer terms, so this paragraph may not apply to you. We may update these Terms from time to time. If a material change is made, we will post a notice on the Platform or send you a notification. Read through any changes, and if you don’t agree to them, please stop using the Platform. If you continue to use our Platform after we notify you of changes, you will be deemed to have accepted the updated Terms, except to the extent prohibited by applicable law.

// </span>

// <p>
// Terms of Sale. By making any purchase with us, you also agree to the Terms of Sale that apply in your country or region.


// </p>

// <span>
// Privacy Policy. Our Privacy Policy describes the collection and use of personal information on the Platform and applies to your use of the Platform.

// </span>

// <span>
// Important Notice for Amateur Athletes. You are responsible for ensuring that your participation on the Platform does not affect your eligibility as an amateur athlete. Please check with your amateur athletic association for the rules that apply to you. Shopprz is not responsible or liable for your use of the Platform resulting in your ineligibility as an amateur athlete.

// </span>
// </>
//       )}
//     </div>
//   );
// };

// export default Page;


import DynamicPage from "../DynamicPage";

const TermsConditions = () => <DynamicPage pageName="TermsConditions" />;

export default TermsConditions;