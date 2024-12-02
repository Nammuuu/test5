
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
      setProfilePictureImagePreview(userProfile.profilePicture);

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

  
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Save base64 string for the image
        setProfilePictureImagePreview(reader.result); // Preview image as base64
      };
  
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();

      // if (profilePicture) {
      //   const base64Image = profilePicture.split(",")[1]; // Extract base64 string part
      //   formData.append("profilePicture", base64Image);
      // }

      if (profilePicture && profilePicture.includes(",")) {
        const base64Image = profilePicture.split(",")[1]; // Extract base64 string part
        formData.append("profilePicture", base64Image);
      }

      formData.append('fullName', fullName);
      formData.append('address', address);
      formData.append('notificationPreferences', notification);
      formData.append('savedShippingAddresses', JSON.stringify(savedShippingAddresses));
      formData.append('billingInfo', JSON.stringify(billingInfo));
      formData.append('deletedAccountRequest', deletedAccountRequest);

      const response = await axios.put(`/api/user/me/profile/${id}`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        router.push(`/me/profile`); // Updated line for redirection
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      handleError(error, "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

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

{/*
      <div className={styles.formGroupprofile}>
 
  <Link href="/" className={styles.backHome}>
    <FaArrowLeft size={24} /> 
  </Link>

  
  <label htmlFor="fullName" className={styles.label}>
    <FaUser className={styles.icon} /> Full Name:
  </label>
  <input
    type="text"
    id="fullName"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className={styles.inputField}
    placeholder="Enter your full name"
  />

 
  <label htmlFor="profilePicture" className={styles.label}>
    <FaPlus className={styles.icon} /> Profile Picture:
  </label>

 
  <input
    type="file"
    id="profilePicture"
    onChange={handleProfilePictureChange}
    className={styles.fileInput}
  />

  
  <div className={styles.uploadIcon} onClick={() => document.getElementById('profilePicture').click()}>
    {profilePictureImagePreview ? (
      <img
        src={profilePictureImagePreview}
        alt="Profile Preview"
        className={styles.profilePreview}
      />
    ) : (
      <FaPlus size={30} className={styles.iconInsideUpload} />
    )}
  </div>
</div>

*/}

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



  // return (
  //   <>
  //     {error ? <p className={styles.errorMessage}>{error}</p> : <p className={styles.userId}>User ID: {userId}</p>}
  //     {loading && <Loader />}
  //    <div className={styles.containerprofileid}  > 
  //     <form onSubmit={handleSubmit} className={styles.profileForm}>

  //       <div className={styles.formGroup}>
          
  //       <label htmlFor="fullName" className={styles.label}>Full Name:</label>
  //       <input
  //         type="text"
  //         id="fullName"
  //         value={fullName}
  //         onChange={(e) => setFullName(e.target.value)}
  //         className={styles.inputField}
  //         placeholder="Enter your full name"
  //       />

  //       <label htmlFor="profilePicture" className={styles.label}>Profile Picture:</label>
  //         <input
  //           type="file"
  //           id="profilePicture"
  //           onChange={handleProfilePictureChange}
  //           className={styles.fileInput}
  //         />
  //         {profilePictureImagePreview && (
  //           <img
  //             src={profilePictureImagePreview}
  //             alt="Profile Preview"
  //             className={styles.profilePreview}
  //           />
  //         )}
  //       </div>

  //       <div className={styles.formGroup}>
  //         <label className={styles.label}>Saved Shipping Addresses:</label>
      
          
  //         {savedShippingAddresses.map((address, index) => (
  //           <div key={index} className={styles.addressContainer}>
  //           <label htmlFor="address" className={styles.label}>Address:</label>
  //             <input
  //               type="text"
  //               name="address"
  //               value={address.address || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="Address"
  //             />
  //             <label htmlFor="address2" className={styles.label}>Address 2:</label>
  //             <input
  //               type="text"
  //               name="address2"
  //               value={address.address2 || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="Address Line 2"
  //             />

  //             <label htmlFor="phoneNo" className={styles.label}>phoneNo:</label>
  //             <input
  //               type="text"
  //               name="phoneNo"
  //               value={address.phoneNo || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="Phone Number"
  //             />
  //             <label htmlFor="city" className={styles.label}>City:</label>
  //             <input
  //               type="text"
  //               name="city"
  //               value={address.city || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="City"
  //             />

  //             <label htmlFor="state" className={styles.label}>State:</label>
  //             <input
  //               type="text"
  //               name="state"
  //               value={address.state || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="State"
  //             />
  //             <label htmlFor="landmark" className={styles.label}>Landmark:</label>
  //             <input
  //               type="text"
  //               name="landmark"
  //               value={address.landmark || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="Landmark"
  //             />
  //             <label htmlFor="Country" className={styles.label}>Country:</label>
  //             <input
  //               type="text"
  //               name="country"
  //               value={address.country || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="Country"
  //             />
  //             <label htmlFor="pinCode" className={styles.label}>PIN Code:</label>
  //             <input
  //               type="text"
  //               name="pinCode"
  //               value={address.pinCode || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               className={styles.addressInput}
  //               placeholder="PIN Code"
  //             />
  //           </div>
  //         ))}

          
  //         <button type="button" onClick={addNewAddress} className={styles.addButton}>Add New Address</button>
  //       </div>
   
  
  //       <div className={styles.formGroup}>
  //         <label htmlFor="deletedAccountRequest" className={styles.checkboxLabel}>
  //           Request Account Deletion:
  //           <input
  //             type="checkbox"
  //             id="deletedAccountRequest"
  //             checked={deletedAccountRequest}
  //             onChange={(e) => setDeletedAccountRequest(e.target.checked)}
  //             className={styles.checkbox}
  //           />
  //         </label>
  //       </div>
  
  //       <div className={styles.buttonContainer}>
  //         <button type="submit" disabled={loading} className={styles.submitButton}>Save Changes</button>
  //         <button onClick={handleDeleteProfile} disabled={loading} className={styles.deleteButton}>Delete Profile</button>
  //       </div>
  //     </form>
  //     </div>
  //   </>
  // );

   

  
  // return (
  //   <>
  //   {error ? <p>{error}</p> : <p>User ID: {userId}</p>}
  //     {loading && <Loader />}
  //     <form onSubmit={handleSubmit} className={styles.profileForm}>
  //       <div className={styles.formGroup}>
        //   <label htmlFor="profilePicture">Profile Picture:</label>
        //   <input type="file" id="profilePicture" onChange={handleProfilePictureChange} />
        //   {profilePictureImagePreview && <img src={profilePictureImagePreview} alt="Profile Preview" width="100" />}
        // </div>
  //       <div className={styles.formGroup}>
  //         <label htmlFor="fullName">Full Name:</label>
  //         <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
  //       </div>
  //       <div className={styles.formGroup}>
  //         <label htmlFor="address">Address:</label>
  //         <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
  //       </div>
  //       <div className={styles.formGroup}>
  //         <label>Notification Preferences:</label>
  //         <input type="text" value={notification} onChange={(e) => setNotification(e.target.value)} />
  //       </div>
  //       <div className={styles.formGroup}>
  //         <label>Saved Shipping Addresses:</label>
  //         {savedShippingAddresses.map((address, index) => (
  //           <div key={index} className={styles.addressContainer}>
  //             <input
  //               type="text"
  //               name="address"
  //               value={address.address || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               placeholder="Address"
  //             />
  //             <input
  //               type="text"
  //               name="city"
  //               value={address.city || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               placeholder="City"
  //             />
  //             <input
  //               type="text"
  //               name="state"
  //               value={address.state || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               placeholder="State"
  //             />
  //             <input
  //               type="text"
  //               name="zipCode"
  //               value={address.zipCode || ''}
  //               onChange={(e) => handleAddressChange(index, e)}
  //               placeholder="Zip Code"
  //             />
  //           </div>
  //         ))}
  //         <button type="button" onClick={addNewAddress} className={styles.addButton}>Add New Address</button>
  //       </div>
  //       <div className={styles.formGroup}>
  //         <label>Billing Info:</label>
  //         <input
  //           type="text"
  //           value={billingInfo.billingName || ''}
  //           onChange={(e) => setBillingInfo({ ...billingInfo, billingName: e.target.value })}
  //           placeholder="Billing Name"
  //         />
  //         <input
  //           type="text"
  //           value={billingInfo.billingAddress || ''}
  //           onChange={(e) => setBillingInfo({ ...billingInfo, billingAddress: e.target.value })}
  //           placeholder="Billing Address"
  //         />
  //       </div>
  //       <div className={styles.formGroup}>
  //         <label htmlFor="deletedAccountRequest">Request Account Deletion:</label>
  //         <input
  //           type="checkbox"
  //           id="deletedAccountRequest"
  //           checked={deletedAccountRequest}
  //           onChange={(e) => setDeletedAccountRequest(e.target.checked)}
  //         />
  //       </div>
  //       <button type="submit" disabled={loading}>Save Changes</button>
  //     </form>
  //     <button onClick={handleDeleteProfile} disabled={loading} className={styles.deleteButton}>Delete Profile</button>
  //   </>
  // );
};

export default UserProfilePage;
