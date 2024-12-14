
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../../styles/admin/setting/settings.module.css";
// import styles from "../../../styles/admin/setting/settings2.module.css";
import { FaEdit, FaCreditCard, FaChartBar, FaFont, FaStore, FaTimes } from 'react-icons/fa';


export default function SettingsPage() {
  const [formData, setFormData] = useState({
    enableCOD: true,
    enableStripe: false,
    stripeKey: "",
    stripeSecret: "",
    enableRazorPay: false,
    razorPayKey: "",
    razorPaySecret: "",
    enableGoogleAnalytics: false,
    googleAnalyticsKey: "",
    themeColor: "#ffffff", // default white color
    shopName: "",
    companyName: "",
    address: "",
    postCode: "",
    contact: "",
    email: "",
    website: "",
    font: "Poppins", // default font
    contrastLayout: false, // default layout
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });


  const [errors, setErrors] = useState({
    stripeError: false,
    razorPayError: false,
  });

  const [settingData, setSettingData] = useState([]);

  const [activeSection, setActiveSection] = useState('shopInfo');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Fetch existing settings when the page loads
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);




  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/setting");
        if (res?.data) {
          setFormData(res.data);  // Ensure you update the formData with the correct settings
          setSettingData(Object.entries(res.data)); 
         
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
  
    fetchSettings();
  }, []);

  

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };





  // Validation for Stripe and RazorPay
  const validateFields = () => {
    let hasError = false;

    if (formData.enableStripe && (!formData.stripeKey || !formData.stripeSecret)) {
      setErrors((prevErrors) => ({ ...prevErrors, stripeError: true }));
      hasError = true;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, stripeError: false }));
    }

    // if (formData.enableRazorPay && (!formData.razorPayKey || !formData.razorPaySecret)) {
    //   setErrors((prevErrors) => ({ ...prevErrors, razorPayError: true }));
    //   hasError = true;
    // } else {
    //   setErrors((prevErrors) => ({ ...prevErrors, razorPayError: false }));
    // }

    // PayPal validation
  if (formData.enablePayPal && (!formData.payPalClientId || !formData.payPalSecret)) {
    setErrors((prevErrors) => ({ ...prevErrors, payPalError: true }));
    hasError = true;
  } else {
    setErrors((prevErrors) => ({ ...prevErrors, payPalError: false }));
  }


    if (formData.enableRazorPay && (!formData.razorPayKey || !formData.razorPaySecret)) {
      setErrors((prevErrors) => ({ ...prevErrors, razorPayError: true }));
      hasError = true;
    }

    return !hasError;
  };

  // Handle form submission using PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return; // prevent submission if there are validation errors
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found, please log in.");
        return;
      }

      // Using PUT request to update settings
      await axios.put("/api/admin/setting", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Failed to update settings:", error);
      alert("Error updating settings");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false); 
    setIsSidebarOpen(false); 
  };

  const toggleSidebar2 = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar open/close
  };



  const shopInfo = {
    ShopName: formData.shopName,
    CompanyName: formData.companyName,
    Address: formData.address,
    PostCode: formData.postCode,
    Contact: formData.contact,
    Email: formData.email,
    Website: formData.website,
  };

  const paymentSettings = {
    enableCOD: formData.enableCOD,
    enableStripe: formData.enableStripe,
    stripeKey: formData.stripeKey,
    stripeSecret: formData.stripeSecret,
    enableRazorPay: formData.enableRazorPay,
    razorPayKey: formData.razorPayKey,
    razorPaySecret: formData.razorPaySecret,
  };

  const analyticsSettings = {
    enableGoogleAnalytics: formData.enableGoogleAnalytics,
    googleAnalyticsKey: formData.googleAnalyticsKey,
  };

  const themeFontSettings = {
    themeColor: formData.themeColor,
    font: formData.font,
    contrastLayout: formData.contrastLayout,
  };

  const SocialmediaSettings = {
    facebook: formData.facebook,
    instagram: formData.instagram,
    twitter: formData.twitter,
    youtube: formData.youtube,
  };

  // Helper function to display a setting block
  const renderSettingSection = (title, settings, editButton) => (
    <div className={styles.settingContainer}>
      <h3>{title}</h3>
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className={styles.settingRow}>
          <span className={styles.settingKey}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          <span className={styles.settingValue}>
            {typeof value === "boolean" ? (value ? "Enabled" : "Disabled") : value}
          </span>
        </div>
      ))}
      {editButton && <div>{editButton}</div>}
      
    </div>
  );

  // <button 
  // className={`${styles.editButton} ${activeSection === 'shopInfo' ? styles.active : ''}`}
  // onClick={() => {
  //   toggleSidebar();
  //   handleSectionChange('shopInfo');
     
  // }}
  // >
  //   <FaEdit /> Edit
  // </button>


  return (
    <div className={styles.container}>
    
      
      <div className={styles.layout}>
        {/* Sidebar Menu */}

        <button onClick={toggleSidebar2} className={styles.toggleButton2}>
          {isSidebarOpen ? <FaTimes /> : <FaStore />}
        </button>

        {isSidebarOpen && (
               <div className={styles.sidebar}>
         
        

         <button onClick={toggleSidebar2} className={styles.toggleButton2}>
          {isSidebarOpen ? <FaTimes /> : <FaStore />}
        </button>
        
          {/* Sidebar Buttons */}
          <button
          className={`${styles.menuButton} ${activeSection === 'shopInfo' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('shopInfo');
             
          }}
        >
          <FaStore className={styles.icon} /> Shop Information
        </button>


        <button
        className={`${styles.menuButton} ${activeSection === 'paymentSettings' ? styles.active : ''}`}
        onClick={() => {
          toggleSidebar();
          handleSectionChange('paymentSettings');

         
        }}
      >
        <FaCreditCard className={styles.icon} /> Payment Settings
      </button>
      <button
        className={`${styles.menuButton} ${activeSection === 'analyticsSettings' ? styles.active : ''}`}
        onClick={() => {
          toggleSidebar();
          handleSectionChange('analyticsSettings');
         
        }}
      >
        <FaChartBar className={styles.icon} /> Analytics Settings
      </button>
      <button
        className={`${styles.menuButton} ${activeSection === 'themeFontSettings' ? styles.active : ''}`}
        onClick={() => {
          toggleSidebar();
          handleSectionChange('themeFontSettings');
          
        }}
      >
        <FaFont className={styles.icon} /> Theme & Font Settings
      </button>

      <button
      className={`${styles.menuButton} ${activeSection === 'SocialmediaSettings' ? styles.active : ''}`}
      onClick={() => {
        toggleSidebar();
        handleSectionChange('SocialmediaSettings');
        
      }}
    >
      <FaFont className={styles.icon} /> Social media 
    </button>



        </div>
)}

        
 {/* center display containet ok  */}

 <div className={styles.contantContaiinerContain} >          

<div> 
<h2>Settings Overview</h2>
<button onClick={toggleSidebar2} className={styles.toggleButton2}>
          {isSidebarOpen ? <FaTimes /> : <FaStore />}
        </button>
</div> 

 <div className={styles.contantContaiiner} >          


      {/* Shop Information Section with Edit Button */}
      {renderSettingSection(
        "Shop Information", 
        shopInfo, 
        <button 
          className={`${styles.editButton} ${activeSection === 'shopInfo' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('shopInfo');
          }}
        >
          <FaEdit /> Edit
        </button>
      )}

      {/* Payment Settings Section with Edit Button */}
      {renderSettingSection(
        "Payment Settings", 
        paymentSettings, 
        <button 
          className={`${styles.editButton} ${activeSection === 'paymentSettings' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('paymentSettings');
          }}
        >
          <FaEdit /> Edit
        </button>
      )}

      {/* Analytics Settings Section with Edit Button */}
      {renderSettingSection(
        "Analytics Settings", 
        analyticsSettings, 
        <button 
          className={`${styles.editButton} ${activeSection === 'analyticsSettings' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('analyticsSettings');
          }}
        >
          <FaEdit /> Edit
        </button>
      )}

      {/* Theme & Font Settings Section with Edit Button */}
      {renderSettingSection(
        "Theme & Font Settings", 
        themeFontSettings, 
        <button 
          className={`${styles.editButton} ${activeSection === 'themeFontSettings' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('themeFontSettings');
          }}
        >
          <FaEdit /> Edit
        </button>
      )}

      {renderSettingSection(
        "social media Settings", 
        SocialmediaSettings, 
        <button 
          className={`${styles.editButton} ${activeSection === 'SocialmediaSettings' ? styles.active : ''}`}
          onClick={() => {
            toggleSidebar();
            handleSectionChange('SocialmediaSettings');
          }}
        >
          <FaEdit /> Edit
        </button>
      )}
   
    
</div>

 </div>

        {/* Main Content - Forms */}
        <div className={`${styles.mainContent} ${sidebarOpen ? styles.open : styles.closed}`}>
<div className={styles.fixpostioncontinaer}>
        <div  className={styles.headincontainer}>
      

        <button className={styles.closeButton} onClick={toggleSidebar}>
        <FaTimes /> {/* Close icon */}
      </button>

      </div>

          
      <form onSubmit={handleSubmit}>

         

            {activeSection === 'shopInfo' && (
              <div className={styles.sectioncontinaer}>
              <h2>Shop Settings</h2>
              <div className={styles.section}>
             
    
              <label className={styles.label}>
                Shop Name:
                <input
                  type="text"
                  name="shopName"
                  value={formData?.shopName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Company Name:
                <input
                  type="text"
                  name="companyName"
                  value={formData?.companyName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Address:
                <input
                  type="text"
                  name="address"
                  value={formData?.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Post Code:
                <input
                  type="text"
                  name="postCode"
                  value={formData?.postCode}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Contact:
                <input
                  type="text"
                  name="contact"
                  value={formData?.contact}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
    
              <label className={styles.label}>
                Website:
                <input
                  type="url"
                  name="website"
                  value={formData?.website}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </label>
            </div>
            </div>

            )}

            {activeSection === 'SocialmediaSettings' && (
              <div className={styles.sectioncontinaer}>
              <h2>Social media Settings</h2>
              <div className={styles.section}>
             


              <label className={styles.label}>
              youtube:
              <input
                type="url"
                name="youtube"
                value={formData?.youtube}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>

            <label className={styles.label}>
            facebook:
            <input
              type="url"
              name="facebook"
              value={formData?.facebook}
              onChange={handleInputChange}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
          twitter:
          <input
            type="url"
            name="twitter"
            value={formData?.twitter}
            onChange={handleInputChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
        instagram:
        <input
          type="url"
          name="instagram"
          value={formData?.instagram}
          onChange={handleInputChange}
          className={styles.input}
        />
      </label>



            </div>
            </div>

            )}




            {activeSection === 'paymentSettings' && (
              <div className={styles.sectioncontinaer}>
              <h2>Payment Settings</h2>
              <div className={styles.section}>
             
          
          <label className={styles.labeldisplayblack}>
            <input
              type="checkbox"
              name="enableCOD"
              checked={formData?.enableCOD}
              onChange={handleInputChange}
            />
            Enable Cash On Delivery (Enabled by default)
          </label>

          <label className={styles.labeldisplayblack}>
            <input
             type="checkbox"
              name="enableStripe"
              checked={formData?.enableStripe}
              onChange={handleInputChange}
            />
            Enable Stripe Payment
          </label>

          {formData?.enableStripe && (
            <>
              <label className={styles.label}>
                Stripe Key:
                <input
                  type="text"
                  name="stripeKey"
                  value={formData?.stripeKey}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                {errors.stripeError && !formData.stripeKey && (
                  <span className={styles.error}>Stripe Key is required.</span>
                )}

              </label>

              <label className={styles.label}>
                Stripe Secret:
                <input
                  type="text"
                  name="stripeSecret"
                  value={formData?.stripeSecret}
                  onChange={handleInputChange}
                  className={styles.input}
                />
                {errors.stripeError && !formData.stripeSecret && (
                  <span className={styles.error}>Stripe Secret is required.</span>
                )}

              </label>
            </>
          )}

          <label className={styles.labeldisplayblack}>
            <input
              type="checkbox"
              name="enableRazorPay"
              checked={formData?.enableRazorPay}
              onChange={handleInputChange}
             
            />
            Enable RazorPay
          </label>
          {formData?.enableRazorPay && (
            <>
              <label>
                RazorPay Key:
                <input
                  type="text"
                  name="razorPayKey"
                  className={styles.input}
                  value={formData?.razorPayKey}
                  onChange={handleInputChange}
                />
                {errors.razorPayError && !formData.razorPayKey && (
                  <span className={styles.error}>RazorPay Key is required.</span>
                )}
              </label>

              <label>
                RazorPay Secret:
                <input
                  type="text"
                  className={styles.input}
                  name="razorPaySecret"
                  value={formData?.razorPaySecret}
                  onChange={handleInputChange}
                />
                {errors.razorPayError && !formData.razorPaySecret && (
                  <span className={styles.error}>RazorPay Secret is required.</span>
                )}
              </label>
            </>
          )}

<label className={styles.labeldisplayblack}>
  <input
    type="checkbox"
    name="enablePayPal"
    checked={formData?.enablePayPal}
    onChange={handleInputChange}
  />
  Enable PayPal Payment
</label>

{formData?.enablePayPal && (
  <>
    <label className={styles.label}>
      PayPal Client ID:
      <input
        type="text"
        name="payPalClientId"
        value={formData?.payPalClientId}
        onChange={handleInputChange}
        className={styles.input}
      />
    </label>

    <label className={styles.label}>
      PayPal Secret:
      <input
        type="text"
        name="payPalSecret"
        value={formData?.payPalSecret}
        onChange={handleInputChange}
        className={styles.input}
      />
    </label>
  </>
)}

</div>
              </div>
            )}

            {activeSection === 'analyticsSettings' && (
            <div className={styles.sectioncontinaer}>
             <h2>Google Analytics</h2>
           
              <div className={styles.section}>
               
              
          <label className={styles.labeldisplayblack}>
            <input
              type="checkbox"
              name="enableGoogleAnalytics"
              checked={formData?.enableGoogleAnalytics}
              onChange={handleInputChange}
            />
            Enable Google Analytics
          </label>

          {formData?.enableGoogleAnalytics && (
            <label className={styles.label}>
              Google Analytics Key:
              <input
                type="text"
                name="googleAnalyticsKey"
                value={formData?.googleAnalyticsKey}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
          )}
     

              </div>
            </div>
            )}

            {activeSection === 'themeFontSettings' && (
              <div className={styles.sectioncontinaer}>
                <h2>Template Settings</h2>
               <div className={styles.section}>
        

          <label className={styles.label}>
            Theme Color:
            <input
              type="color"
              name="themeColor"
              value={formData?.themeColor}
              onChange={handleInputChange}
              className={styles.colorPicker}
            />
          </label>

          <label className={styles.label}>
            Font:
            <select
              name="font"
              value={formData?.font}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="Poppins">Poppins Google Font</option>
              <option value="Open Sans">Open Sans Google Font</option>
              <option value="Montserrat">Montserrat Google Font</option>
              <option value="Mukta">Mukta Google Font</option>
            </select>
          </label>

          <label className={styles.labeldisplayblack}>
            <input
              type="checkbox"
              name="contrastLayout"
              checked={formData?.contrastLayout}
              onChange={handleInputChange}
            />
            Enable Contrast Layout for Products
          </label>
        </div>
        </div>

            )}

          

            <button type="submit" className={styles.saveButton}>
              Save Settings
            </button>
          </form>

          </div>
        </div>


      </div>
    </div>
  );

}



