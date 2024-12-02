
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";
import styles from "../../../../styles/admin/setting/thamesettings.module.css";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";
import Image from "next/image";
// Frontend component for theme settings page
const ThamwSettingsPage = () => {
  const [themeSettings, setThemeSettings] = useState({
    fontfamily: "Arial",
    fontcolor: "#333333",
    bgcolor: "#ffffff",
    cardbgcolor: "#000000",
    loginlogo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginLogoPreview, setLoginLogoPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
 

  const fontFamilies = ["Arial", "Verdana", "Helvetica", "Times New Roman", "Georgia", "Courier New"];

  const router = useRouter();

  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get("/api/admin/setting/thamesatting", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThemeSettings(response.data.themeSettings);
      } catch (error) {
        handleError(error, "Failed to fetch theme settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchThemeSettings();
  }, [handleError]);

  // Handle file change and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLoginLogoPreview(reader.result);
      reader.readAsDataURL(file);
      setThemeSettings({ ...themeSettings, loginlogo: file });
    }
  };

  // Handle form submission to update theme settings
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData(); // Use FormData for handling file uploads

      // Append each field to FormData
      formData.append("fontfamily", themeSettings.fontfamily);
      formData.append("fontcolor", themeSettings.fontcolor);
      formData.append("bgcolor", themeSettings.bgcolor);
      formData.append("cardbgcolor", themeSettings.cardbgcolor);

      // Append the raw login logo file (not base64)
      if (themeSettings.loginlogoFile) {
        formData.append("loginlogo", themeSettings.loginlogoFile); // Raw file is appended
      }

      const response = await axios.put("/api/admin/setting/thamesatting", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setThemeSettings(response.data.themeSettings);
      toast.success("Theme settings updated successfully!");
    } catch (error) {
      handleError(error, "Failed to update theme settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = useCallback(
    (error, defaultMessage) => {
      const errorMessage = error.response?.data?.message || error.message || defaultMessage;

      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
        router.push("/login");
      } else {
        toast.error(errorMessage);
      }

      console.error(errorMessage);
    },
    [router]
  );

  const navigateToHome = () => {
    // router.push("/admin/dashboard");
  };

  return (
    <div className={styles.container}>
      <div className={styles.ShippingInformation}>
        <button onClick={navigateToHome} className={styles.arrowButton}>
          <FaArrowLeft />
          
        </button>
        <div className={styles.ShippingInformationh1}>
          <h1>Manage Theme Settings</h1>
        </div>
        <button className={styles.button} onClick={() => setShowModal(true)}>
          Update Settings
        </button>
      </div>

      {loading && <Loader />}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.settingsForm}>
        {/* Font Family Selector */}
        <label>Font Family</label>
        <select
          value={themeSettings.fontfamily}
          onChange={(e) => setThemeSettings({ ...themeSettings, fontfamily: e.target.value })}
          className={styles.select}
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        {/* Font Color Selector */}
        <label>Font Color</label>
        <input
          type="color"
          value={themeSettings.fontcolor}
          onChange={(e) => setThemeSettings({ ...themeSettings, fontcolor: e.target.value })}
          className={styles.colorPicker}
        />

        {/* Background Color Selector */}
        <label>Background Color</label>
        <input
          type="color"
          value={themeSettings.bgcolor}
          onChange={(e) => setThemeSettings({ ...themeSettings, bgcolor: e.target.value })}
          className={styles.colorPicker}
        />

        {/* Card Background Color Selector */}
        <label>Card Background Color</label>
        <input
          type="color"
          value={themeSettings.cardbgcolor}
          onChange={(e) => setThemeSettings({ ...themeSettings, cardbgcolor: e.target.value })}
          className={styles.colorPicker}
        />

        {/* Login Logo File Upload */}
        <label>Login Logo</label>
        <input type="file" onChange={handleFileChange} />
        {loginLogoPreview && (
          <div>
              <Image
              src={loginLogoPreview} alt="Logo Preview" className={styles.previewImage} 
        width={500}
        height={500}
      />

      
          </div>
        )}

        {/* Update Settings Button */}
        <button onClick={handleUpdateSettings} className={styles.button} disabled={loading}>
          {loading ? "Updating..." : "Update Settings"}
        </button>
      </div>

      {/* Real-Time Preview Box */}
      <div className={styles.previewBox} style={{ backgroundColor: themeSettings.bgcolor }}>
        <div
          className={styles.cardPreview}
          style={{
            fontFamily: themeSettings.fontfamily,
            color: themeSettings.fontcolor,
            backgroundColor: themeSettings.cardbgcolor,
          }}
        >
          <p>This is a preview of the card.</p>
          <Image
        src={themeSettings?.loginlogo} alt="Login Logo" className={styles.previewLogo} 
        width={500}
        height={500}
      />

    
          {loginLogoPreview &&  
            <Image
            src={loginLogoPreview} alt="Login Logo" className={styles.previewLogo} 
      width={500}
      height={500}
    />
    }

        </div>
      </div>

      {showModal && (
        <>
          <div className={styles.overlay} onClick={() => setShowModal(false)} />
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
              <FaTimes />
            </button>
            <h2>Update Theme Settings</h2>
            <button onClick={handleUpdateSettings} className={styles.button} disabled={loading}>
              {loading ? "Updating..." : "Update Settings"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ThamwSettingsPage;
