


// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Image from "next/image";
// import Link from "next/link";

// export default function BannerPage() {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Banner form state
//   const [formData, setFormData] = useState({
//     title: "",
//     heading: "",
//     description: "",
//     productUrl: "",
//     image: null, // Single image
//   });

//   // Image preview for the selected image
//   const [imagePreview, setImagePreview] = useState("");

//   // Fetch banners from the API when the component mounts
//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get("/api/admin/home/banner");
//         setBanners(res.data);
//       } catch (error) {
//         setError(error.message || "Failed to fetch banners");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, []);

//   // Handle form input changes
  // const handleInputChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (name === "image") {
  //     const file = files[0];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       image: file, // Save single image file
  //     }));

  //     // Show image preview
  //     const reader = new FileReader();
  //     reader.onloadend = () => setImagePreview(reader.result);
  //     reader.readAsDataURL(file);
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

//   // Handle form submission to create a new banner
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!formData.image) {
//       alert("Please upload an image.");
//       return;
//     }
  
//     const formDataToSend = new FormData();
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("heading", formData.heading);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("productUrl", formData.productUrl);
//     formDataToSend.append("image", formData.image); // Single image file
  
//     try {
//       const token = localStorage.getItem("token"); // Retrieve the token from local storage
  
//       if (!token) {
//         alert("No token found, please log in.");
//         return;
//       }
  
//       const res = await axios.post("/api/admin/home/banner", formDataToSend, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`, // Attach token in the request headers
//         },
//       });
  
//       const newBanner = res.data.banner;
//       setBanners((prevBanners) => [...prevBanners, newBanner]); // Update banner list
//       alert("Banner created successfully");
  
//       // Reset form and image preview
//       setFormData({
//         title: "",
//         heading: "",
//         description: "",
//         productUrl: "",
//         image: null,
//       });
//       setImagePreview("");
//     } catch (error) {
//       alert("Failed to create banner");
//       console.log("error", error.message)
//       // setError(error.message || "Failed to create banner");
//     }
//   };
  

//   if (loading) return <p>Loading banners...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h1>Manage Home Page Banners</h1>

//       <div>
//         <h2>Create New Banner</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Title:</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Heading:</label>
//             <input
//               type="text"
//               name="heading"
//               value={formData.heading}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Description:</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Product URL:</label>
//             <input
//               type="url"
//               name="productUrl"
//               value={formData.productUrl}
//               onChange={handleInputChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Banner Image:</label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleInputChange}
//               required
//             />
//           </div>

//           {imagePreview && (
//             <div>
//               <h4>Image Preview:</h4>
//               <img
//                 src={imagePreview}
//                 alt="Image Preview"
//                 style={{ width: "200px", height: "auto" }}
//               />
//             </div>
//           )}

//           <button type="submit">Create Banner</button>
//         </form>
//       </div>

//       <hr />

//       <div className="banner-list">
//         {banners.map((banner) => (
//           <div key={banner._id} className="banner-item">
//             <h2>{banner.title}</h2>
//             <h3>{banner.heading}</h3>
//             <p>{banner.description}</p>
//             <a href={banner.productUrl} target="_blank" rel="noopener noreferrer">
//               View Product
//             </a>

          

//             <div className="banner-images">
//          {/*     <Image
//                 src={banner.images[0]} 
//                 alt={banner.title}
//                 layout="responsive"
//                 width={600} 
//                 height={400}
//               /> */}
//             </div>

            
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         .banner-list {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 20px;
//         }
//         .banner-item {
//           padding: 20px;
//           border: 1px solid #ddd;
//           border-radius: 8px;
//         }
//         .banner-images img {
//           width: 100%;
//           height: auto;
//           margin-top: 10px;
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "../../../../styles/admin/home/banner.module.css"; 
import Link from "next/link";
import {
  FaBars,
  FaTimes, 
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaCog,
} from "react-icons/fa";
import ThamwSettingsPage from "./Themasatting"

export default function BannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Popup state

  // Banner form state
  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    description: "",
    productUrl: "",
    image: null, // Single image
  });

  const [imagePreview, setImagePreview] = useState("");

  // Fetch banners from the API when the component mounts
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/admin/home/banner");
        setBanners(res.data);
      } catch (error) {
        setError(error.message || "Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission to create a new banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("productUrl", formData.productUrl);
    formDataToSend.append("image", formData.image);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found, please log in.");
        return;
      }

      const res = await axios.post("/api/admin/home/banner", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const newBanner = res.data.banner;
      setBanners((prevBanners) => [...prevBanners, newBanner]);
      alert("Banner created successfully");

      // Reset form and hide popup
      setFormData({
        title: "",
        heading: "",
        description: "",
        productUrl: "",
        image: null,
      });
      setImagePreview("");
      setShowPopup(false); // Close popup after submission
    } catch (error) {
      alert("Failed to create banner");
    }
  };

  // Handle deleting a banner
  const handleDelete = async (bannerId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found, please log in.");
        return;
      }

      await axios.delete(`/api/admin/home/banner/${bannerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBanners(banners.filter((banner) => banner._id !== bannerId));
    } catch (error) {
      alert("Failed to delete banner");
    }
  };

  if (loading) return <p>Loading banners...</p>;
  if (error) return <p>{error}</p>;



  return (
    <div className={styles.container}>
      <h1>Manage Home Page Banners</h1>
  
     <div className={styles.buttoncontainer}> 
      <button onClick={() => setShowPopup(true)} className={styles.createButton}>
        Create Banner
      </button>

      <ThamwSettingsPage />
      </div> 
  
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
          
            <form onSubmit={handleSubmit} className={styles.formGrid}>
            <div className={styles.gridContainer}>

              <div className={styles.gridItemContainer}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className={styles.inputField}
                />
</div>
                <div className={styles.gridItem}>
                <label>Heading:</label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  required
                  className={styles.inputField}
                />
              </div>


                <div className={styles.gridItem}>
                <label>Product URL:</label>
                <input
                  type="url"
                  name="productUrl"
                  value={formData.productUrl}
                  onChange={handleInputChange}
                  required
                  className={styles.inputField}
                />
              </div>

              </div>
          
            
          
            
          
              <div className={styles.gridItemFull}>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className={styles.textareaField}
                />
              </div>
          
              <div className={styles.gridItemFull}>
                <label>Banner Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  required
                  className={styles.inputFile}
                />
              </div>
          
              {imagePreview && (
                <div className={styles.imagePreview}>
                  <h4 className={styles.imagePreviewh}>Image Preview:</h4>
                  <Image
                src={imagePreview}
                    alt="Image Preview"
                    style={{ maxWidth: "100px", }}
        width={500}
        height={500}
      />



                </div>
              )}
            </div>
          
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>
                Create Banner
              </button>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className={styles.closeButto_n}
              >
                Close
              </button>
            </div>
          </form>
          
          </div>
        </div>
      )}
  
      <div className={styles.bannerList}>
        {banners.map((banner) => (
          <div key={banner._id} className={styles.bannerItem}>
           
            
            <div className={styles.bannerImages}>
              <Image
                src={banner.images}
                alt={banner.title}
                layout="responsive"
                width={600}
                height={400}
              />
              
            </div>


            <div className={styles.bannerItemDetailsContainer}>

            <h2>{banner.title.length > 15 ? banner.title.slice(0, 15) + "..." : banner.title}</h2>
            <h3>{banner.heading.length > 15 ? banner.heading.slice(0, 15) + "..." : banner.heading}</h3>
            <p>{banner.description.length > 15 ? banner.description.slice(0, 15) + "..." : banner.description}</p>

            
          </div>


            <div className={styles.deleteButtonContainer} > 
            <Link className={styles.deleteButton} href={banner.productUrl} target="_blank" rel="noopener noreferrer">
                View Product
              </Link>
            <button onClick={() => handleDelete(banner._id)} className={styles.deleteButton}>
              Delete Banner
            </button>
            </div>
          </div>

        ))}
      </div>
    </div>
  );

  
//   return (
//     <div className={styles.container}>
//       <h1>Manage Home Page Banners</h1>

//       <button onClick={() => setShowPopup(true)} className={styles.createButton}>
//         Create Banner
//       </button>

//       {/* Banner creation popup */}
//       {showPopup && (
//         <div className={styles.popup}>
//           <div className={styles.popupContent}>
//             <h2>Create New Banner</h2>
//             <form onSubmit={handleSubmit}>

//               <div>
//                 <label>Title:</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label>Heading:</label>
//                 <input
//                   type="text"
//                   name="heading"
//                   value={formData.heading}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label>Description:</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label>Product URL:</label>
//                 <input
//                   type="url"
//                   name="productUrl"
//                   value={formData.productUrl}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <label>Banner Image:</label>
//                 <input
//                   type="file"
//                   name="image"
//                   accept="image/*"
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               {imagePreview && (
//                 <div>
//                   <h4>Image Preview:</h4>
//                   <img
//                     src={imagePreview}
//                     alt="Image Preview"
//                     style={{ width: "200px", height: "auto" }}
//                   />
//                 </div>

//               )}

//               <button type="submit">Create Banner</button>
//               <button type="button" onClick={() => setShowPopup(false)}>
//                 Close
//               </button>

//             </form>
//           </div>
//         </div>
//       )}

//       <div className={styles.bannerList}>
//         {banners.map((banner) => (
//           <div key={banner._id} className={styles.bannerItem}>

//           <div className={styles.bannerItemDetailsContainer}> 
//             <h2>{banner.title}</h2>
//             <h3>{banner.heading}</h3>
//             <p>{banner.description}</p>
// </div>



//             <div className={styles.bannerImages}>             
//                    <Image
//                 src={banner.images} 
//                 alt={banner.title}
//                 layout="responsive"
//                 width={600}
//                 height={400}
//               /> 

//               <Link href={banner.productUrl} target="_blank" rel="noopener noreferrer">
//               View Product
//             </Link>

//             </div>

//             <button onClick={() => handleDelete(banner._id)} className={styles.deleteButton}>
//               Delete Banner
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
}
