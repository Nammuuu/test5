



"use client";

import { useEffect, useState, useRef } from 'react';
import styles from '../styles/components/Footer.module.css';
import { FaLock, FaTruck, FaHeadset, FaDollarSign, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Link from "next/link";
import Loading from "./Loader"
import { useRouter,  } from 'next/navigation';

const Footer = () => {
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const router = useRouter();
 // Handle route change events

 
 useEffect(() => {
  const handleRouteChangeStart = () => {
    setIsLoading(true); // Start loading when route change starts
  };

  const handleRouteChangeComplete = () => {
    setIsLoading(false); // Stop loading when route change completes
  };

  // Listen for route change events
  router.events?.on('routeChangeStart', handleRouteChangeStart);
  router.events?.on('routeChangeComplete', handleRouteChangeComplete);
  router.events?.on('routeChangeError', handleRouteChangeComplete); // Also stop loading if there is an error

  return () => {
    // Cleanup listeners on unmount
    router.events?.off('routeChangeStart', handleRouteChangeStart);
    router.events?.off('routeChangeComplete', handleRouteChangeComplete);
    router.events?.off('routeChangeError', handleRouteChangeComplete);
  };
}, [router]);
  

  return (
   <div className={styles.footerContainer}>
 
 {isLoading && <Loading />} 
 
   <div className={styles.benefitContainer}>
     <div className={styles.benefitItem}>
     <FaHeadset />
     <div>
       <h3>Professional Service</h3>
       <p>Efficient customer support from passionate team</p>
       </div>
     </div>
     <div className={styles.benefitItem}>
     <FaLock />
     <div>
       <h3>Secure Payment</h3>
       <p>Different secure payment methods</p>
       </div>
     </div>

     <div className={styles.benefitItem}>
     <FaTruck />
     <div>
       <h3>Fast Delivery</h3>
       <p>Fast and convenient door-to-door delivery</p>
       </div>
     </div>
     <div className={styles.benefitItem}>

     <FaDollarSign />
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
      <h1 className={styles.logo}> Logo </h1>
      </div>
      
      <h3>Subscribe to our newsletter</h3>
        <form className={styles.subscribeForm}>
        
        <div className={styles.inputContainer}>
      
          <input
            type="email"
            placeholder="Your email address"
            className={styles.inputField}
          />
          <button  onClick={() => setIsLoading(true)} type="submit" className={styles.subscribeButton}>Subscribe</button>
        </div>
      </form>
      

        <div className={styles.icons}>
        <Link  onClick={() => setIsLoading(true)} href="https://facebook.com"><FaFacebook /></Link>
        <Link onClick={() => setIsLoading(true)}  href="https://instagram.com"><FaInstagram /></Link>
        <Link  onClick={() => setIsLoading(true)} href="https://twitter.com"><FaTwitter /></Link>
        <Link  onClick={() => setIsLoading(true)} href="https://youtube.com"><FaYoutube /></Link>
     </div>

      </div>




      
        <div className={styles.support}>
          <h4>Support</h4>
          <ul>
            <li> <Link onClick={() => setIsLoading(true)} href="/faq">FAQ </Link></li>
            <li> <Link onClick={() => setIsLoading(true)} href="/Shipping">Shipping</Link></li>
            <li> <Link onClick={() => setIsLoading(true)} href="/ReturnExchange">Return & Exchange</Link></li>
           
            <li> <Link  onClick={() => setIsLoading(true)} href="/AboutUs"> About Us</Link></li>
          </ul>
        </div>

        <div className={styles.legal}>
          <h4>Legal</h4>
          <ul>
            <li> <Link onClick={() => setIsLoading(true)}  href="/CookiesPolicy">Cookies Policy</Link></li>
            <li> <Link  onClick={() => setIsLoading(true)} href="/TermsConditions">Terms & Conditions</Link></li>
           <li>  <Link href="/privacy" onClick={() => setIsLoading(true)}>Privacy Policy</Link> </li>
         
            <li> <Link  onClick={() => setIsLoading(true)} href="/ContactUs">Contact Us</Link></li>
           

          </ul>
        </div>

        <div className={styles.about}>
          <h4>Contact Us</h4>
          <ul>
            
            <li>House: 25, Road No: 2, Block A,
            <br />
             Mirpur-1, Dhaka 1216</li>
            <li>Email: info@inilabs.net</li>
            <li>Phone: 13333846282</li>
          </ul>
        </div>

        
      
      </div>
      <div className={styles.copyright}>
      <p>© Shop by inodri 2024, All Rights Reserved</p>
    </div>
    </footer>
    </div>
  );
};

export default Footer;
