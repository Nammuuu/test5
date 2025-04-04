
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [userIdGet, setUserIdGet] = useState('');
  
  const [error, setError] = useState('');
  const router = useRouter();

  const { id } = useParams();

  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureImagePreview, setProfilePictureImagePreview] = useState("");
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [notification, setNotification] = useState('');
  // const [savedShippingAddresses, setSavedShippingAddresses] = useState([{}]);
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);
  const [billingInfo, setBillingInfo] = useState({});
  const [deletedAccountRequest, setDeletedAccountRequest] = useState(false);
  const [loading, setLoading] = useState(false);

  const [existingUserProfile, setExistingUserProfile] = useState(null);


  const [username, setUsername ] = useState('your name');
  const profileRef = useRef(null);


  const fetchUserId = useCallback(async  () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found in local storage');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get(`/api/user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (!data._id) {
        toast.error('User ID not found. Redirecting...');
        router.push('/login');
        return;
      }

      setUserIdGet(data._id);
      setUsername(data.username);

    } catch (error) {
      console.error('Error fetching user ID:', error);
      toast.error('Error fetching user ID.');
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);


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
      setExistingUserProfile(userProfile);
      setUserId(userProfile.userId);
      setFullName(userProfile.fullName);
      setAddress(userProfile.address);
      setNotification(userProfile.notificationPreferences);
      setSavedShippingAddresses(userProfile.savedShippingAddresses || []);
      setBillingInfo(userProfile.billingInfo);
      setDeletedAccountRequest(userProfile.deletedAccountRequest);
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

const handleProfilePictureChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setProfilePictureImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};


// const handleProfilePictureChange = (e) => {
//     const file = e.target.files[0];
  
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePicture(reader.result); // Save base64 image
//         setProfilePictureImagePreview(reader.result); // Preview image
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setProfilePicture(""); // Remove image if the user clears it
//       setProfilePictureImagePreview("");
//     }
// };

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


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const token = localStorage.getItem('token');
//   if (!token) {
//     console.error("❌ No token found, redirecting to login.");
//     router.push('/login');
//     return;
//   }

//   const formData = new FormData();
//   if (fullName) formData.append("fullName", fullName.trim());
//   if (address) formData.append("address", address.trim());

//   if (profilePictureImagePreview && profilePictureImagePreview.includes(",")) {
//     const base64Data = profilePictureImagePreview.split(",")[1];
//     formData.append("profilePicture", base64Data);
//   }

//   try {
//     const response = await axios.put(`/api/user/me/profile/${userId}`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log("✅ Profile Updated:", response.data);

//     if (response.status === 200) {
//       toast.success("Profile updated successfully!");

//       // **🔹 Update the state immediately with new profile picture**
//       setProfilePictureImagePreview(`${response.data.profilePicture}?t=${new Date().getTime()}`);

//       // **🔹 Also, re-fetch the profile to ensure UI sync**
//       fetchUserProfile();
//     }
//   } catch (error) {
//     console.error("❌ Profile Update Error:", error);
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No token found, redirecting to login.");
    router.push("/login");
    return;
  }

  const formData = new FormData();
  formData.append("savedShippingAddresses", JSON.stringify(savedShippingAddresses));

  if (fullName) {
    formData.append("fullName", fullName.trim());
  } else {
    console.warn("⚠️ fullName is empty and will not be sent.");
  }

  if (address) {
    formData.append("address", address.trim());
  } else {
    console.warn("⚠️ address is empty and will not be sent.");
  }

  if (profilePictureImagePreview && profilePictureImagePreview.includes(",")) {
    const base64Data = profilePictureImagePreview.split(",")[1];
    formData.append("profilePicture", base64Data);
  }

  

  // if (savedShippingAddresses.length > 0) {
  //   formData.append("savedShippingAddresses", JSON.stringify(savedShippingAddresses));
  // }

  // Log the data being sent
  console.log("🔹 FormData Entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    // const response = await axios.put(`/api/user/me/profile/${userId}`, formData, {
      const response = await axios.put(`/api/user/me/profile/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Profile Updated:", response.data);

    if (response.status === 200) {
      toast.success("Profile updated successfully!");

      if (response.data.profilePicture) {
        setProfilePictureImagePreview(`${response.data.profilePicture}?t=${new Date().getTime()}`);
      }

      // if (response.data.savedShippingAddresses) {
      //   setSavedShippingAddresses(response.data.savedShippingAddresses);
      // }

      fetchUserProfile();
    }
  } catch (error) {
    console.error("❌ Profile Update Error:", error);
    toast.error("Failed to update profile. Please try again.");
  } finally {
    setLoading(false);
  }
};


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const token = localStorage.getItem('token');
//   if (!token) {
//     console.error("❌ No token found, redirecting to login.");
//     router.push('/login');
//     return;
//   }

//   const formData = new FormData();

//   // Append Basic User Info
//   if (fullName) formData.append("fullName", fullName.trim());
//   if (address) formData.append("address", address.trim());

//   // Append Profile Picture if it exists
//   if (profilePictureImagePreview && profilePictureImagePreview.includes(",")) {
//     const base64Data = profilePictureImagePreview.split(",")[1];
//     formData.append("profilePicture", base64Data);
//   }

//   // Append Shipping Addresses (Convert array to JSON string)
//   if (savedShippingAddresses.length > 0) {
//     formData.append("savedShippingAddresses", JSON.stringify(savedShippingAddresses));
//   }

//   try {
//     const response = await axios.put(`/api/user/me/profile/${userId}`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log("✅ Profile Updated:", response.data);

//     if (response.status === 200) {
//       toast.success("Profile updated successfully!");

//       // **🔹 Update profile picture preview**
//       if (response.data.profilePicture) {
//         setProfilePictureImagePreview(`${response.data.profilePicture}?t=${new Date().getTime()}`);
//       }

//       // **🔹 Update saved addresses in state**
//       if (response.data.savedShippingAddresses) {
//         setSavedShippingAddresses(response.data.savedShippingAddresses);
//       }

//       // **🔹 Re-fetch the profile to sync UI**
//       fetchUserProfile();
//     }
//   } catch (error) {
//     console.error("❌ Profile Update Error:", error);
//     toast.error("Failed to update profile. Please try again.");
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

// const handleAddressChange = (index, e) => {
//     const { name, value } = e.target;
//     const newAddresses = [...savedShippingAddresses];
//     newAddresses[index] = {
//       ...newAddresses[index],
//       [name]: value,
//     };
//     setSavedShippingAddresses(newAddresses);
// };

const handleAddressChange = (index, e) => {
  const { name, value } = e.target;

  setSavedShippingAddresses(prevAddresses =>
    prevAddresses.map((address, i) =>
      i === index ? { ...address, [name]: value } : address
    )
  );
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
  src={profilePictureImagePreview || "/default-avatar.png"}
  alt="Profile Picture"
  width={150}
  height={150}
  className={styles.profilePicture}
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
    <h3> Welcome, {username ? username : 'Guest'}!</h3>
    
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
      
      <label htmlFor={`address-${index}`} className={styles.label}>
        <FaMapMarkerAlt /> Address:
      </label>
      <input
        type="text"
        id={`address-${index}`}
        name="address"
        value={address.address || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="Address"
      />

      <label htmlFor={`address2-${index}`} className={styles.label}>
        <FaHome /> Address 2:
      </label>
      <input
        type="text"
        id={`address2-${index}`}
        name="address2"
        value={address.address2 || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="Address Line 2"
      />

      <label htmlFor={`phoneNo-${index}`} className={styles.label}>
        <FaPhone /> Phone No:
      </label>
      <input
        type="text"
        id={`phoneNo-${index}`}
        name="phoneNo"
        value={address.phoneNo || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="Phone Number"
      />

      <label htmlFor={`city-${index}`} className={styles.label}>
        <FaCity /> City:
      </label>
      <input
        type="text"
        id={`city-${index}`}
        name="city"
        value={address.city || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="City"
      />

      <label htmlFor={`state-${index}`} className={styles.label}>
        <FaFlag /> State:
      </label>
      <input
        type="text"
        id={`state-${index}`}
        name="state"
        value={address.state || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="State"
      />

      <label htmlFor={`landmark-${index}`} className={styles.label}>
        <FaMapMarkerAlt /> Landmark:
      </label>
      <input
        type="text"
        id={`landmark-${index}`}
        name="landmark"
        value={address.landmark || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="Landmark"
      />

      <label htmlFor={`country-${index}`} className={styles.label}>
        <FaFlag /> Country:
      </label>
      <input
        type="text"
        id={`country-${index}`}
        name="country"
        value={address.country || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="Country"
      />

      <label htmlFor={`pinCode-${index}`} className={styles.label}>
        <FaMapMarkerAlt /> PIN Code:
      </label>
      <input
        type="text"
        id={`pinCode-${index}`}
        name="pinCode"
        value={address.pinCode || ''}
        onChange={(e) => handleAddressChange(index, e)}
        className={styles.addressInput}
        placeholder="PIN Code"
      />

      {/* Remove Address Button */}
      {/* <button 
        type="button" 
        onClick={() => removeAddress(index)} 
        className={styles.deleteAddressButton}
      >
        <FaTrashAlt /> Remove
      </button> */}

    </div>
  ))}
</div>


        {/* <div className={styles.ShippingAddressescontainer}> 
        {savedShippingAddresses.map((address, index) => (
          <div key={index} className={styles.addressContainer}>
           
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

        
        </div> */}

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
 



