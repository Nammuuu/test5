

"use client"

import { useState } from 'react';
import LoginRegister from './login/page'; // Update with the correct path
import styles from "./Auth.module.css"
import { FaTimes, FaUser, FaSignInAlt } from 'react-icons/fa';

const Auth = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div>
      <div onClick={togglePopup} className={styles.openButton}>
      <FaUser />
      </div> 

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <div className={`${styles.closeButton} popupicons`} onClick={togglePopup}>
            <FaTimes />
            </div>
            <LoginRegister />
          </div>
        </div>
      )}
    </div>
  );
};


export default Auth;

