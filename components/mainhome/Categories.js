
// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import styles from "../../styles/components/category.module.css";
// import Loader from "../Loader";

// import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import Link from "next/link";
// import Image from "next/image";

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const itemsPerSlide = 3; 

//   // Fetch all categories
//   // useEffect(() => {
//   //   const fetchCategories = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const response = await axios.get("/api/user/category/cate");
//   //       setCategories(response.data.categories);
//   //     } catch (error) {
//   //       console.error("Error fetching categories:", error);
//   //       toast.error("Failed to fetch categories.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchCategories();
//   // }, []);

 
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("/api/user/category/cate", {
//           headers: {
//            "Cache-Control": "no-cache",
//             Pragma: "no-cache",
//             Expires: "0",
//           },
//         });
//         setCategories(response.data.categories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         toast.error("Failed to fetch categories.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchCategories();
//   }, []);

  

//   // Handle navigation between slides
//   const nextSlide = () => {
//     setCurrentSlide((prevSlide) => 
//       (prevSlide + 1) % Math.ceil(categories.length / itemsPerSlide)
//     );
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prevSlide) =>
//       prevSlide === 0 ? Math.ceil(categories.length / itemsPerSlide) - 1 : prevSlide - 1
//     );
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className={styles.container}>
//       <div className={styles.categoryHeadingContainer}>
//         <h1 className={styles.categoryHeadingtitle}>Browse by Categories</h1>
//         <div className={styles.categoryIconsContainer}>
//           <FaArrowLeft onClick={prevSlide} className={styles.arrow} />
//           <FaArrowRight onClick={nextSlide} className={styles.arrow} />
//         </div>
//       </div>

//       <div className={styles.carouselContainer}>
//         <div
//           className={styles.categoryList}
//           style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//         >
//           {categories.map((category) => (
//             <div key={category._id} className={styles.categoryContainer}>
//               <Link href={`/category/${category._id}`} className={styles.categoryLink}>
//                 <Image
//                   src={category.categoryImage || "/path/to/default-image.jpg"}
//                   alt={category.name}
//                   className={styles.previewImage}
//                   width={500}
//                   height={500}
//                   priority
//                 />
//                 <h2 className={styles.categoryheading}>{category?.name?.length > 13 ? category.name.slice(0, 13) + "..." : category.name}</h2>
//                 {/* <h2 className={styles.categoryheading}>{category.name}</h2> */}
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Categories;


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader";
import styles from "../../styles/components/category.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Categories = () => {
  const [categories, setCategories] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 3;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/user/category/cate", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const fetchedCategories = response.data.categories || []; // Ensure it is an array
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle navigation between slides
  const nextSlide = () => {
    setCurrentSlide((prevSlide) =>
      (prevSlide + 1) % Math.ceil(categories.length / itemsPerSlide)
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? Math.ceil(categories.length / itemsPerSlide) - 1 : prevSlide - 1
    );
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.categoryHeadingContainer}>
        <h1 className={styles.categoryHeadingtitle}>Browse by Categories</h1>
        <div className={styles.categoryIconsContainer}>
          <FaArrowLeft onClick={prevSlide} className={styles.arrow} />
          <FaArrowRight onClick={nextSlide} className={styles.arrow} />
        </div>
      </div>

      <div className={styles.carouselContainer}>
        <div
          className={styles.categoryList}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} className={styles.categoryContainer}>
                <Link href={`/category/${category._id}`} className={styles.categoryLink}>
                  <Image
                    src={category.categoryImage || "/path/to/default-image.jpg"}
                    alt={category.name}
                    className={styles.previewImage}
                    width={500}
                    height={500}
                    priority
                  />
                  <h2 className={styles.categoryheading}>
                    {category?.name?.length > 13 ? category.name.slice(0, 13) + "..." : category.name}
                  </h2>
                </Link>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
