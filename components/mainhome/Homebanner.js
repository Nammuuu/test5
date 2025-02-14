


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import styles from "../../styles/components/banner.module.css";
// import Link from "next/link";
// import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaCircle, FaHeart } from "react-icons/fa";
// import Loader from "../Loader";
// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

// const Banner = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get(`/api/admin/home/Banners?displayOptions=${displayOptions}`);
//         setBanners(res.data);
//       } catch (error) {
//         console.error("Failed to fetch banners", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanners();
//   }, [displayOptions]); // Refetch banners when displayOptions changes

  

 

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
//           <div
//             key={banner._id}
//             className={`${styles.bannerItem} ${index === currentIndex ? styles.active : ""}`}
//           >
//             <div className={styles.bannerImages}>
             
            
//             {(banner?.title || banner?.heading || banner?.description) && (
//               <div className={styles.bannerItemDetailsContainer}>
//                 {/* <h2>{banner?.title?.length > 50 ? banner.title.slice(0, 50) + "..." : banner.title}</h2> */}
//                 {/* <h3>{banner?.heading?.length >  30 ? banner.heading.slice(0, 30) + "..." : banner.heading}</h3> */}
//                 {/* <p>{banner?.description?.length > 100 ? banner.description.slice(0, 100) + "..." : banner.description}</p> */}
//               </div>
//             )}
            
          
//           <Image
//                 src={banner.images}
//                 alt={banner.title}
//                 width={900}
//                 height={900}  
//               />

//               <div className={styles.paginationContainer}>
//   {banners.map((_, index) => (
//     <button
//       key={index}
//       onClick={() => setCurrentIndex(index)}
//       className={`${styles.paginationDot} ${index === currentIndex ? styles.activeDot : ""}`}
//     >
//       <FaCircle />
//     </button>
//   ))}
// </div>

//             </div>

          

           

//             <div className={styles.viewButtonContainer}>
//               <Link href={banner.productUrl} target="_blank" rel="noopener noreferrer">
//                 View Product
//               </Link>
//             </div>
//           </div>
//         ))}

//         {/* Slider control buttons */}
       
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

// export default Banner;



"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "../../styles/components/banner.module.css";
import Link from "next/link";
import { FaCircle } from "react-icons/fa";
import Loader from "../Loader";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayOptions, setDisplayOptions] = useState("Baner1");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`/api/admin/home/Banners?displayOptions=${displayOptions}`);
        setBanners(res.data);
      } catch (error) {
        console.error("Failed to fetch banners", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, [displayOptions]);

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
  };

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.bannerContainer}>
      <select onChange={(e) => setDisplayOptions(e.target.value)} value={displayOptions}>
        <option value="Baner1">Banner 1</option>
        <option value="Baner2">Banner 2</option>
        <option value="Baner3">Banner 3</option>
        <option value="Baner4">Banner 4</option>
        <option value="Baner5">Banner 5</option>
      </select>
      
      <div className={styles.slider} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={banner._id} className={`${styles.bannerItem} ${index === currentIndex ? styles.active : ""}`}>            
            <Image src={banner.images} alt={banner.title} width={900} height={900} />
            <div className={styles.paginationContainer}>
              {banners.map((_, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)} className={`${styles.paginationDot} ${i === currentIndex ? styles.activeDot : ""}`}>
                  <FaCircle />
                </button>
              ))}
            </div>
            <div className={styles.viewButtonContainer}>
              <Link href={banner.productUrl} target="_blank" rel="noopener noreferrer">View Product</Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.IconsnContainer}>
        <button className={styles.prevButton} onClick={handlePrevSlide}><IoIosArrowBack /></button>
        <button className={styles.nextButton} onClick={handleNextSlide}><IoIosArrowForward /></button>
      </div>
    </div>
  );
};

export default Banner;
