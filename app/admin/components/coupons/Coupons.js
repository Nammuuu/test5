


'use client';

import { useState, useEffect } from 'react';
import styles from "./CouponsPage.module.css";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [validUntil, setValidUntil] = useState('');

  // Fetch all coupons on page load
  useEffect(() => {
    async function fetchCoupons() {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      setCoupons(data);
    }

    fetchCoupons();
  }, []);

  // Add a new coupon
  const addCoupon = async () => {
    const newCoupon = { code, discount: Number(discount), validUntil };
    
    const response = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCoupon)
    });

    if (response.ok) {
      const addedCoupon = await response.json();
      setCoupons([...coupons, addedCoupon]);
    } else {
      alert('Failed to add coupon');
    }
  };

  // Delete a coupon
  const deleteCoupon = async (id) => {
    const response = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });

    if (response.ok) {
      setCoupons(coupons.filter(coupon => coupon._id !== id));
    } else {
      alert('Failed to delete coupon');
    }
  };

  return (
    <div className={styles.graphContainer}>
      <h1 className={styles.Heading}>Coupons Management</h1>

      {/* Add Coupon Form */}
      <div className={styles.Container}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
        <button onClick={addCoupon}>Add Coupon</button>
      </div>

      {/* Display Coupons */}
      <div className={styles.ContainerAll}>
      <h2 className={styles.smallHeading}>All Coupons</h2>
      <ul>
        {coupons?.map((coupon) => {
          // Ensure coupon.validUntil is a valid date before trying to display it
          const expiryDate = coupon?.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : 'No Expiry';
    
          return (
            <li key={coupon._id}>
              <strong>{coupon?.code}</strong> 
              - {coupon?.discount}%
              <p className={styles.smallHeadingptag}>  Expires on: {expiryDate} </p>
              <button onClick={() => deleteCoupon(coupon._id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>

    
    </div>
  );
}
