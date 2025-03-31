
"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Loader from "../../../../../components/Loader";
import Image from 'next/image';
import styles from '../../../../../styles/user/profile/prodfileid.module.css';
import { FaPhone,  FaSave, FaUser, FaHome, FaCity, FaFlag, FaMapMarkerAlt, FaFileUpload, FaTrashAlt, FaPlus, FaArrowLeft } from 'react-icons/fa';
import Link from "next/link";


const UserProfilePage = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { id } = useParams();

  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureImagePreview, setProfilePictureImagePreview] = useState("");
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [notification, setNotification] = useState('');
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([{}]);
  const [billingInfo, setBillingInfo] = useState({});
  const [deletedAccountRequest, setDeletedAccountRequest] = useState(false);
  const [loading, setLoading] = useState(false);



  const fetchUserProfile = useCallback(async   () => {

    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      setError('No token found in local storage');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/user/me/profile/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const userProfile = response.data;
      setUserId(userProfile.userId)
      setFullName(userProfile.fullName);
      setAddress(userProfile.address);
      setNotification(userProfile.notificationPreferences);
      setSavedShippingAddresses(userProfile.savedShippingAddresses);
      setBillingInfo(userProfile.billingInfo);
      setDeletedAccountRequest(userProfile.deletedAccountRequest);
      // setProfilePictureImagePreview(userProfile.profilePicture);
// ✅ Set profile picture correctly
setProfilePicture(userProfile.profilePicture || "");
setProfilePictureImagePreview(userProfile.profilePicture || "");

    } catch (error) {
      toast.info('update your profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      setError('No token found in local storage');
      return;
    }

    try {    
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to decode token:', error);
      setError('Failed to decode token.');
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // No warnings now
  


  useEffect( () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found in local storage');
      setError('No token found in local storage');
      return;
    }

    try {    
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to decode token:', error);
      setError('Failed to decode token.');
    }
  }, [fetchUserProfile, router]);

  
  // const handleProfilePictureChange = (e) => {
  //   const file = e.target.files[0];
  
  //   if (file) {
  //     const reader = new FileReader();
  
  //     reader.onloadend = () => {
  //       setProfilePicture(reader.result); // Save base64 string for the image
  //       setProfilePictureImagePreview(reader.result); // Preview image as base64
  //     };
  
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Save base64 image
        setProfilePictureImagePreview(reader.result); // Preview image
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePicture(""); // Remove image if the user clears it
      setProfilePictureImagePreview("");
    }
  };



  const handleError = useCallback((error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || error.message || defaultMessage;

    if (error.response?.status === 401) {
      toast.error("Unauthorized. Please login again.");
      router.push("/login");
    } else {
      toast.error(errorMessage);
    }

    console.error(errorMessage);
  }, [router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("fullName", fullName?.trim() || "");
      formData.append("address", address?.trim() || "");
      formData.append("deletedAccountRequest", deletedAccountRequest);
  
      // ✅ Handle saved shipping addresses
      savedShippingAddresses.forEach((address, index) => {
        Object.entries(address).forEach(([key, value]) => {
          formData.append(`savedShippingAddresses[${index}][${key}]`, value);
        });
      });
  
      // ✅ Handle profile picture correctly
      // if (profilePicture) {
       
      //   if (profilePicture.includes(",")) {
      //     formData.append("profilePicture", profilePicture.split(",")[1]); // Convert to base64
      //   } else {
      //     formData.append("profilePicture", profilePicture); // Keep existing URL
      //   }
      // } else {
      //   formData.append("profilePicture", ""); // Ensure empty string is sent if user removes it
      // }

      if (profilePicture) {
        if (profilePicture.includes(",")) {
          const base64Data = profilePicture.split(",")[1]; // Extract base64 only
          console.log("Base64 Data (First 100 chars):", base64Data.slice(0, 100));
          formData.append("profilePicture", base64Data);
        } else {
          console.log("Existing Profile Picture URL:", profilePicture);
          formData.append("profilePicture", profilePicture); // Keep URL
        }
      } else {
        console.log("Profile Picture Removed");
        formData.append("profilePicture", ""); // User removed the profile picture
      }
      

      console.log("Form Data Received:", formData);
      // console.log("Received Profile Picture:", profilePictureBase64 ? profilePictureBase64.slice(0, 100) : "Not Provided");
      
  
      const response = await axios.put(`/api/user/me/profile/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        router.push(`/me/profile`);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      handleError(error, "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  
  //   try {
  //     const formData = new FormData();
  //     formData.append("fullName", fullName?.trim() || "");
  //     formData.append("address", address?.trim() || "");
  //     formData.append("deletedAccountRequest", deletedAccountRequest);
  
  //     // ✅ Ensure `savedShippingAddresses` is handled properly
  //     savedShippingAddresses.forEach((address, index) => {
  //       Object.entries(address).forEach(([key, value]) => {
  //         formData.append(`savedShippingAddresses[${index}][${key}]`, value);
  //       });
  //     });
  
  //     // ✅ Handle profile picture (allow removal)
  //     if (profilePicture) {
  //       if (profilePicture.includes(",")) {
  //         const base64Image = profilePicture.split(",")[1];
  //         formData.append("profilePicture", base64Image);
  //       }
  //     } else {
  //       formData.append("profilePicture", ""); // Ensure empty string is sent if the user removes it
  //     }
  
  //     console.log("Submitting FormData:", Object.fromEntries(formData));
  
  //     const response = await axios.put(`/api/user/me/profile/${id}`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data", // ✅ Ensure correct Content-Type
  //       },
  //     });
  
  //     if (response.status === 200) {
  //       toast.success("Profile updated successfully!");
  //       router.push(`/me/profile`);
  //     } else {
  //       throw new Error("Failed to update profile.");
  //     }
  //   } catch (error) {
  //     handleError(error, "Failed to update profile.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
    
  const handleDeleteProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`/api/user/me/profile/${id}`);

      if (response.status === 200) {
        toast.success("Profile deleted successfully!");
        router.push(`/me/profiles`); // Redirect to another page after deletion
      } else {
        throw new Error("Failed to delete profile.");
      }
    } catch (error) {
      handleError(error, "Failed to delete profile.");
    } finally {
      setLoading(false);
    }
  };



  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const newAddresses = [...savedShippingAddresses];
    newAddresses[index] = {
      ...newAddresses[index],
      [name]: value,
    };
    setSavedShippingAddresses(newAddresses);
  };

  const addNewAddress = () => {
    setSavedShippingAddresses([...savedShippingAddresses, {}]);
  };





return (
  <>
    {error ? <p className={styles.errorMessage}>{error}</p> : <p className={styles.userId}>User ID: {userId}</p>}
    {loading && <Loader />}
    <div className={styles.containerprofileid}>

      <form onSubmit={handleSubmit} className={styles.profileForm}>

<div className={styles.formGroupprofile}>
  {/* Back to Home Icon */}
  <Link href="/" className={styles.backHome}>
    <FaArrowLeft size={24} /> 
  </Link>

  {/* Profile Picture Container */}
  <div className={styles.profileContainer}>
    {profilePictureImagePreview ? (
     

      <Image
      src={profilePictureImagePreview}
        alt="Profile Preview"
        className={styles.profilePicture}
      width={150}
      height={150}
      
      priority
    />

    ) : (
      <div className={styles.defaultPicture}>N</div> /* Default avatar with initial */
    )}

    {/* Add new profile picture */}
    <div className={styles.addProfileIcon}>
      <FaPlus onClick={() => document.getElementById('profilePicture').click()} />
    </div>
  </div>

  {/* Hidden File Input */}
  <input
    type="file"
    id="profilePicture"
    onChange={handleProfilePictureChange}
    className={styles.fileInput}
  />

  {/* User Info */}
  <div className={styles.userInfo}>
    <h3>{fullName || "Full Name"}</h3>
    
  </div>

</div>




        <div className={styles.ShippingAddresses}>
        <div className={styles.header}>
          <label className={styles.label}>Saved Shipping Addresses:</label>
          
          <button type="button" onClick={addNewAddress} className={`${styles.addButton} ${styles.displayNone}`}> 
          <FaPlus /> Add New Address
        </button>
        </div>
      
        <div className={styles.ShippingAddressescontainer}> 
        {savedShippingAddresses.map((address, index) => (
          <div key={index} className={styles.addressContainer}>
            {/* Address Fields with Icons */}
            <label htmlFor="address" className={styles.label}><FaMapMarkerAlt /> Address:</label>
            <input
              type="text"
              name="address"
              value={address.address || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="Address"
            />
      
            <label htmlFor="address2" className={styles.label}><FaHome /> Address 2:</label>
            <input
              type="text"
              name="address2"
              value={address.address2 || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="Address Line 2"
            />
      
            <label htmlFor="phoneNo" className={styles.label}><FaPhone /> Phone No:</label>
            <input
              type="text"
              name="phoneNo"
              value={address.phoneNo || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="Phone Number"
            />
      
            <label htmlFor="city" className={styles.label}><FaCity /> City:</label>
            <input
              type="text"
              name="city"
              value={address.city || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="City"
            />
      
            <label htmlFor="state" className={styles.label}><FaFlag /> State:</label>
            <input
              type="text"
              name="state"
              value={address.state || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="State"
            />
      
            <label htmlFor="landmark" className={styles.label}><FaMapMarkerAlt /> Landmark:</label>
            <input
              type="text"
              name="landmark"
              value={address.landmark || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="Landmark"
            />
      
            <label htmlFor="country" className={styles.label}><FaFlag /> Country:</label>
            <input
              type="text"
              name="country"
              value={address.country || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="Country"
            />
      
            <label htmlFor="pinCode" className={styles.label}><FaMapMarkerAlt /> PIN Code:</label>
            <input
              type="text"
              name="pinCode"
              value={address.pinCode || ''}
              onChange={(e) => handleAddressChange(index, e)}
              className={styles.addressInput}
              placeholder="PIN Code"
            />
          </div>
        ))}

        
        </div>

        <button type="button" onClick={addNewAddress} className={styles.addButton}>
        <FaPlus /> Add New Address
      </button>
      </div>
      


    
      <div className={styles.formGroupx}>
      <label htmlFor="deletedAccountRequest" className={styles.checkboxLabel}>
        <FaTrashAlt className={styles.icon} /> Request Account Deletion
        <input
          type="checkbox"
          id="deletedAccountRequest"
          checked={deletedAccountRequest}
          onChange={(e) => setDeletedAccountRequest(e.target.checked)}
          className={styles.checkbox}
        />
      </label>
      
     
    </div>

        {/* Submit and Delete Profile Buttons with Icons */}
        <div className={styles.buttonContainer}>

        {/* Account Deletion Section */}
        
        <button onClick={handleDeleteProfile} disabled={loading} className={styles.deleteButton}>
        Delete Profile <FaTrashAlt className={styles.icon} />
      </button>

        {/* Save Changes Button */}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          Save Changes <FaSave className={styles.icon} />
        </button>
      
      </div>
      
      </form>
    </div>
  </>
);
 
};

export default UserProfilePage;
 