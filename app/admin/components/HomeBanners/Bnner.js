



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
import Loader from "../../../../components/Loader";
// import ThamwSettingsPage from "./Themasatting";

export default function BannerPaget() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [displayOptions, setDisplayOptions] = useState("Baner1");
  const [formData, setFormData] = useState({
    productUrl: "",
    image: null,
    displayOptions: "Baner1",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/home/Banners?displayOptions=${displayOptions}`);
        setBanners(res.data);
      } catch (error) {
        setError(error.message || "Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [displayOptions]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prevData) => ({ ...prevData, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!formData.image) {
  //     alert("Please upload an image.");
  //     return;
  //   }

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("productUrl", formData.productUrl);
  //   formDataToSend.append("image", formData.image);
  //   formDataToSend.append("displayOptions", formData.displayOptions);

  //   setLoading(true);
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("No token found, please log in.");
  //       return;
  //     }

  //     const res = await axios.post("/api/admin/home/Banners", formDataToSend, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const newBanner = res.data.banner;
  //     setBanners((prevBanners) => [...prevBanners, newBanner]);
  //     alert("Banner created successfully");

  //     setFormData({ productUrl: "", image: null, displayOptions: "Baner1" });
  //     setImagePreview("");
  //     setShowPopup(false);
  //   } catch (error) {
  //     alert("Failed to create banner");
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.image || !formData.productUrl || !formData.displayOptions) {
      alert("All fields are required.");
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append("productUrl", formData.productUrl.trim());
    formDataToSend.append("image", formData.image);
    formDataToSend.append("displayOptions", formData.displayOptions);
  
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found, please log in.");
        return;
      }
  
      const res = await axios.post("/api/admin/home/Banners", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const newBanner = res.data.banner;
      setBanners((prevBanners) => [...prevBanners, newBanner]);
      alert("Banner created successfully");
  
      setFormData({ productUrl: "", image: null, displayOptions: "Baner1" });
      setImagePreview("");
      setShowPopup(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to create banner");
    } finally {
      setLoading(false);
    }
  };

  
  const handleDelete = async (bannerId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found, please log in.");
        return;
      }
      await axios.delete(`/api/admin/home/Banners/${bannerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBanners(banners.filter((banner) => banner._id !== bannerId));
    } catch (error) {
      alert("Failed to delete banner");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1>Manage Home Page Banners</h1>
      <div className={styles.buttoncontainer}>
        <button onClick={() => setShowPopup(true)} className={styles.createButton}>Create Banner</button>
       
      </div>
     
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>

          <form onSubmit={handleSubmit} className={styles.formGrid}>
  {/* Product URL Input */}

  <select value={displayOptions} onChange={(e) => setDisplayOptions(e.target.value)}>
        <option value="Baner1">Banner 1</option>
        <option value="Baner2">Banner 2</option>
        <option value="Baner3">Banner 3</option>
        <option value="Baner4">Banner 4</option>
        <option value="Baner5">Banner 5</option>
      </select>
      
  <input 
    type="text" 
    name="productUrl" 
    value={formData.productUrl} 
    onChange={handleInputChange} 
    placeholder="Enter product URL" 
    required 
  />

  {/* Image Upload Input */}
  <input 
    type="file" 
    name="image" 
    accept="image/*" 
    onChange={handleInputChange} 
    required 
  />
  
  {/* Image Preview */}
  {imagePreview && <Image src={imagePreview} alt="Preview" width={100} height={100} />}
  
  {/* Submit and Close Buttons */}
  <button type="submit">Create Banner</button>
  <button type="button" onClick={() => setShowPopup(false)}>Close</button>
</form>
          </div>
        </div>
      )}
      <div className={styles.bannerList}>
        {banners.map((banner) => (
          <div key={banner._id} className={styles.bannerItem}>
            <Image src={banner.images} alt={banner.title} width={600} height={400} />
            <div className={styles.deleteButtonContainer} > 
            <Link className={styles.deleteButton} href={banner.productUrl} target="_blank">View Product</Link>
            <button onClick={() => handleDelete(banner._id)} className={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
