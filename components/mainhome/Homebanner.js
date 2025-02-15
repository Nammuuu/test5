


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import styles from "../../styles/components/banners.module.css";
// import Link from "next/link";
// import { FaCircle } from "react-icons/fa";
// import Loader from "../Loader";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// const Homebanner = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         // const res = await axios.get(`/api/admin/home/Banners?displayOptions=${displayOptions}`);
//         const res = await axios.get("/api/admin/home/Banners?displayOptions=Baner1");
//         setBanners(res.data);
//       } catch (error) {
//         console.error("Failed to fetch banners", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanners();
//   }, []);

//   const handlePrevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
//   };

//   const handleNextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className={styles.bannerContainer}>
//       <div className={styles.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
//         {banners.map((banner, index) => (
//           <div key={banner._id} className={`${styles.bannerItem} ${index === currentIndex ? styles.active : ""}`}> 
//            <div className={styles.bannerImages}>           
//             <Image src={banner.images} alt={banner.title} width={900} height={900} />
//             </div>

//             <div className={styles.viewButtonContainer}>
//               <Link href={banner.productUrl} target="_blank" rel="noopener noreferrer">View Product</Link>
//             </div>
//           </div>



//         ))}
//       </div>

//       <div  className={styles.IconsnContainer}> 
//       <button className={styles.prevButton} onClick={handlePrevSlide}>
//         <IoIosArrowBack />
//       </button>
//       <button className={styles.nextButton} onClick={handleNextSlide}>
//         <IoIosArrowForward />
//       </button>
//       </div>

//     </div>
//   );
// };

// export default Homebanner;



"use client";

import React from 'react'

import Homebanner from "./Homebanners/Bnner"
import Homebannerto from "./Homebanners/Bnnerto"
import Homebannerthre from "./Homebanners/Bnnerthree"

const Homebannermain = () => {
  return (
    <div>
     
    <Homebanner />
    <Homebannerto />
    <Homebannerthre />

    </div>
  )
}

export default Homebannermain

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import styles from "../../styles/components/banner.module.css";
// import Link from "next/link";
// import Loader from "../Loader";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// const Homebanner = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get("/api/admin/home/Banners?displayOptions=Baner1");
//         setBanners(res.data);
//       } catch (error) {
//         console.error("Failed to fetch banners", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanners();
//   }, []);

//   const handlePrevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
//   };

//   const handleNextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   if (banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className={styles.bannerContainer}>
//       <div className={styles.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
//         {banners.map((banner, index) => (
//           <div key={banner._id} className={`${styles.bannerItem} ${index === currentIndex ? styles.active : ""}`}>
//             <div className={styles.bannerImages}>
//               <Image src={banner.images} alt={banner.title} width={900} height={900} />
//             </div>
           
//           </div>
//         ))}
//       </div>

//       <div className={styles.IconsnContainer}> 
//         <button className={styles.prevButton} onClick={handlePrevSlide}>
//           <IoIosArrowBack />
//         </button>
//         <button className={styles.nextButton} onClick={handleNextSlide}>
//           <IoIosArrowForward />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Homebanner;
