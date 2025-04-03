
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";
import Image from 'next/image';
import Link from "next/link";
import gsap from 'gsap';
import {
  FaUserCircle, FaAddressBook,
  FaBell, FaCreditCard, FaTrashAlt,
  FaClock, FaCalendarAlt, FaMoon,
  FaSun, FaPencilAlt,
  FaUserEdit
} from 'react-icons/fa';
import Loader from '../../../../components/Loader';
import styles from '../../../../styles/user/profile/profile.module.css';
 
const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('your name');
  const [address, setAddress] = useState('your address');
  const [notification, setNotification] = useState('');
  const [billingInfo, setBillingInfo] = useState({});
  const [profileCreatedAt, setProfileCreatedAt] = useState('');
  const [error, setError] = useState('');
  const [profilePictureImagePreview, setProfilePictureImagePreview] = useState('');
  const [savedShippingAddresses, setSavedShippingAddresses] = useState(["addrsss", "Your Shipping Addresses",]);
  const [deletedAccountRequest, setDeletedAccountRequest] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);
  const [username, setUsername ] = useState('your name');
  const profileRef = useRef(null);
  const router = useRouter();



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

      setUserId(data._id);
      setUsername(data.username);

    } catch (error) {
      console.error('Error fetching user ID:', error);
      toast.error('Error fetching user ID.');
      router.push('/login');
    }
  }, [router]);

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
     if (!token) {
      toast.error('No token found');
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/user/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userProfile = response.data;
      setUserId(userProfile._id);
      setFullName(userProfile.fullName);
      setAddress(userProfile.address);
      setNotification(userProfile.notificationPreferences);
      setBillingInfo(userProfile.billingInfo || {});
      setSavedShippingAddresses(userProfile.savedShippingAddresses || []);
      setDeletedAccountRequest(userProfile.deletedAccountRequest);
      setProfilePictureImagePreview(userProfile.profilePicture);
      setProfileCreatedAt(new Date(userProfile.createdAt).toLocaleString()); // Profile creation time
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Show toast if profile is not found
        toast.info('Update Your Profile.');
        router.push(`/me/profile/${userProfile._id}`);
      } else {
        // Handle other errors
        console.error('Failed to fetch profile:', error);
        setError('Failed to fetch profile.');
      }
    } finally {
      setLoading(false);
    }
  },  [router]);
  

  // const fetchUserProfile = useCallback(async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     toast.error('No token found');
  //     router.push('/login');
  //     return;
  //   }
  
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(`/api/user/me/profile`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     const userProfile = response.data;
  //     console.log("🔄 Fetching Updated Profile:", userProfile);
  
  //     setUserId(userProfile._id);
  //     setFullName(userProfile.fullName);
  //     setAddress(userProfile.address);
  //     setNotification(userProfile.notificationPreferences);
  //     setBillingInfo(userProfile.billingInfo || {});
  //     setSavedShippingAddresses(userProfile.savedShippingAddresses || []);
  //     setDeletedAccountRequest(userProfile.deletedAccountRequest);
      
  //     // **🔥 Force re-render of the profile picture**
  //     setProfilePictureImagePreview(`${userProfile.profilePicture}?t=${new Date().getTime()}`);
  
  //   } catch (error) {
  //     console.error('Failed to fetch profile:', error);
  //     setError('Failed to fetch profile.');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [router]);

  
  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);
  

  useEffect(() => {
    fetchUserProfile();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); 
    return () => clearInterval(timer); 

  }, [fetchUserProfile]);

  const getGreeting = () => {
    if (!currentTime) return ''; 
    const hour = currentTime.getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  useEffect(() => {
    gsap.from(profileRef.current, { opacity: 0, y: 50, duration: 0.5 });
  }, [activeSection]);

  return (
    <div className={styles.container}>
      {loading ? (
        <Loader />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className={styles.contentWrapper}>
          {/* Top bar navigation */}
          <div className={styles.topNav}>
            <button
              className={`${styles.navButton} ${activeSection === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveSection('profile')}
            >
              <FaUserCircle /> Profile
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'address' ? styles.active : ''}`}
              onClick={() => setActiveSection('address')}
            >
              <FaAddressBook /> Address
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'notification' ? styles.active : ''}`}
              onClick={() => setActiveSection('notification')}
            >
              <FaBell /> Notification
            </button>
            <button
              className={`${styles.navButton} ${activeSection === 'billing' ? styles.active : ''}`}
              onClick={() => setActiveSection('billing')}
            >
              <FaCreditCard /> Billing Info
            </button>
          </div>

          {/* Content Section */}
          <div ref={profileRef} className={styles.sectionContent}>
            {activeSection === 'profile' && (
              <div className={styles.profileSection}>
                <div className={styles.profileSectioncontainer}>
                  <div className={styles.header}>

                    {profilePictureImagePreview ? (
                      <Image
                        src={profilePictureImagePreview}
                        alt="Profile Picture"
                        width={150}
                        height={150}
                        className={styles.profilePicture}
                        priority
                      />
                    ) : (
                      <p>No profile picture available.</p>
                    )}
                    <p><strong>Full Name:</strong> {username ? username : 'Guest'}!</p>
                    
                    <p><strong>Profile Created At:</strong> {profileCreatedAt}</p>
                  </div>

                  <div className={styles.header}>
                    <h1>
                      {getGreeting()},
                      <span className={styles.username}>
                        {username ? username : 'Guest'}!
                      </span>


                    </h1>
                    <div className={styles.currentTime}>
                      {currentTime && (
                        <>
                          <span className={styles.usermonicondatatime}>
                            <FaClock /> {currentTime.toLocaleTimeString()}
                            <FaCalendarAlt style={{ marginLeft: '10px' }} /> {currentTime.toLocaleDateString()}
                          </span>

                        </>
                      )}
                    </div>
                  </div>


                </div>
                <div className={styles.ButtonContainer}>
                  <Link href={`/me/profile/${userId}`} className={styles.deleteButton}>
                    <FaTrashAlt />  Delete Account
                  </Link>


                  {/* Left side bottom button */}
                  <Link href={`/me/profile/${userId}`} className={styles.updateButton}>
                    <FaUserEdit />  Update Profile
                  </Link>
                </div>

              </div>


            )}

            {activeSection === 'address' && (
              <div className={styles.addressSection}>


                <h1 className={styles.title}>Address</h1>
              {/*  <p className={styles.addressInfo}>

                  <strong>Address:</strong> {address ? address : 'No address available'}
                </p> */}

                

                {savedShippingAddresses.length > 0 ? (
                  savedShippingAddresses.map((address, index) => (

                    <div key={index} className={styles.addressCard}>
                      
                        <div className={styles.addressheader}>
                        <p className={styles.indexaddress}>
                        <strong className={styles.addressInfo} >Address {index + 1}:</strong> {address.addressLine1}
                        
                      </p>
                          <Link href={`/me/profile/${userId}`} className={styles.editLink}>
                            <FaPencilAlt className={styles.editIcon} />
                          </Link>
                        </div>



                      <p><strong>Address:</strong> {address.address}</p>
                      <p><strong>Address 2:</strong> {address.address2}</p>
                      <p><strong>Phone Numbar:</strong> {address.phoneNo}</p>
                      <p><strong>Country:</strong> {address.country}</p>
                      <p><strong>City:</strong> {address.city}</p>
                      <p><strong>State:</strong> {address.state}</p>
                      <p><strong>Landmark:</strong> {address.landmark}</p>
                        <p><strong>Pin Code:</strong> {address.pinCode}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noAddresses}>No saved addresses.</p>
                )}
              </div>
            )}



            {activeSection === 'notification' && (
              <div className={styles.notificationSection}>
                <h1>Notification</h1>
                <p>{notification ? notification : 'No notifications set.'}</p>

              </div>
            )}

            {activeSection === 'billing' && (
              <div className={styles.billingSection}>
                <h1>Billing Info</h1>
                <p>{billingInfo.billingAddress ? billingInfo.billingAddress : 'No billing info available'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;


