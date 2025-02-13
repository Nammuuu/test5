



"use client";


import styles from '../styles/components/Footer.module.css';
import { FaLock, FaTruck,
   FaHeadset, FaDollarSign,
   FaFacebook, FaInstagram,
    FaTwitter, FaYoutube,
    FaHeartbeat,
    FaHandHoldingHeart,
    FaWallet,
   } from 'react-icons/fa';
import Link from "next/link";
import Loading from "./Loader"
import { RiServiceFill } from "react-icons/ri";
// import { useRouter,  } from 'next/navigation';

import {  useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname  } from 'next/navigation';

import axios from "axios";


const Footer = () => {
  // State to track loading
  const router = useRouter();
  const navbarRef = useRef(null);
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [prevPathname, setPrevPathname] = useState(pathname);

  const [formData, setFormData] = useState({
   
    themeColor: "#ffffff", 
    shopName: "",
    website: "",
    font: "Poppins", 
    address: "",
    postCode: "", 
    contact: "",
    email: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",

  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/setting");
        if (res?.data) {
          setFormData(res.data);  // Ensure you update the formData with the correct settings
        
         
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
  
    fetchSettings();
  }, []);

 // Handle route change events

 
// Handler for link clicks
const handleLinkClick = (link) => {
  if (link === pathname) {
    console.log("Same page click, no loader.");
    return; // Don't trigger loading for the same page
  }
  
  console.log(`Navigating to ${link}`);
  setIsLoading(true);
  router.push(link); // Change route using Next.js router
};


// Effect to track pathname changes for loading state
useEffect(() => {
  // Whenever the pathname changes, we set loading to true
  const handlePathChange = () => {
    setIsLoading(true);
  };

  // Set loading to false after navigating
  const handlePathChangeComplete = () => {
    console.log("Route change completed");
    setIsLoading(false);
  };

  // Listen to pathname changes
  handlePathChange();

  // You can use a small timeout to simulate the completion of loading
  const timeout = setTimeout(() => {
    handlePathChangeComplete();
  }, 500); // Adjust the timeout based on your loading needs

  // Clean up timeout on component unmount
  return () => {
    clearTimeout(timeout);
  };
}, [pathname]); // Run effect on pathname change



  return (
   <div className={styles.footerContainer}>
 
 {isLoading && <Loading />} 
 
   <div className={styles.benefitContainer}>

   <div className={styles.benefitItem}>
     <FaTruck />
     <div>
       <h3>Fast Delivery</h3>
       <p>Fast and convenient door-to-door delivery</p>
       </div>
     </div>
     <div className={styles.benefitItem}>
     <FaWallet />
     <div>
       <h3>Secure Payment</h3>
       <p>Different secure payment methods</p>
       </div>
     </div>
     
     <div className={styles.benefitItem}>
     <RiServiceFill />
     <div>
       <h3>Professional Service</h3>
       <p>Efficient customer support from passionate team</p>
       </div>
     </div>
     
     <div className={styles.benefitItem}>

<FaHandHoldingHeart />
<div>
  <h3>Quality & Savings</h3>
  <p>Comprehensive quality control and affordable prices</p>
  </div>
</div>


     
   </div>


 


    <footer className={styles.footer}>

      

      <div className={styles.footerSections}>



      <div className={styles.subscribeSection}>

      <div> 
      <h1 className={styles.logo}> {formData?.shopName} </h1>
      </div>
      
      <h3>Subscribe to our newsletter</h3>
        <form className={styles.subscribeForm}>
        
        <div className={styles.inputContainer}>
      
          <input
            type="email"
            placeholder="Your email address"
            className={styles.inputField}
          />
            <button   type="submit" className={styles.subscribeButton}>Subscribe</button>
          {/* <button  onClick={() => handleLinkClick("/ContactUs")} type="submit" className={styles.subscribeButton}>Subscribe</button> */}
        </div>
      </form>
      

        <div className={styles.icons}>
      

        <Link  onClick={() => handleLinkClick(`https://facebook.com`)} href="https://facebook.com"><FaFacebook /></Link>
        <Link onClick={() => handleLinkClick(`https://instagram.com`)}  href="https://instagram.com"><FaInstagram /></Link>
        <Link  onClick={() => handleLinkClick(`https://twitter.com`)} href="https://twitter.com"><FaTwitter /></Link>
        <Link  onClick={() => handleLinkClick(`https://youtube.com`)} href="https://youtube.com"><FaYoutube /></Link>
     </div>

      </div>




      
        <div className={styles.support}>
          <h4>Support</h4>
          <ul>
            
            <li> <Link onClick={() => handleLinkClick("/Shipping")} href="/Shipping">Shipping</Link></li>
            <li> <Link  href="/ContactUs" onClick={() => handleLinkClick("/ContactUs")} >Contact Us</Link></li>
            <li> <Link onClick={() => handleLinkClick("/ReturnExchange")} href="/ReturnExchange">Return & Exchange</Link></li>
            <li> <Link onClick={() => handleLinkClick("/CookiesPolicy")}  href="/CookiesPolicy">Cookies Policy</Link></li>
            
          </ul>
        </div>

        <div className={styles.legal}>
          <h4>Legal</h4>
          <ul>
          <li> <Link  onClick={() => handleLinkClick("/TermsConditions")} href="/TermsConditions">Terms & Conditions</Link></li>
          <li> <Link onClick={() => handleLinkClick("/faq")} href="/faq">FAQ </Link></li>
          <li> <Link  onClick={() => handleLinkClick("/AboutUs")} href="/AboutUs"> About Us</Link></li>
            
           
           <li>  <Link href="/privacy" onClick={() => handleLinkClick("/privacy")}>Privacy Policy</Link> </li>
         
            
           

            

          </ul>
        </div>

        <div className={styles.about}>
          <h4>Contact Us</h4>
          <ul>
            
          <li>
           Address:  {formData?.address}
            {formData?.postCode}
            
            </li>
            <li>Email: {formData?.email} </li>
            <li>Phone: {formData?.contact}</li>

            
          </ul>
        </div>

        
      
      </div>
      <div className={styles.copyright}>
      <p>© Shop by {formData?.shopName} 2050, All Rights Reserved</p>
    </div>
    </footer>
    </div>
  );
};

export default Footer;
