"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import styles from '../../styles/home/OrderConfirmation.module.css';
import styles from '../../../styles/admin/Admin.module.css';


const OrderConfirmationPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // Redirect to the homepage after a few seconds
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.orderConfirmationPage}>
      <h1>Thank you for your order!</h1>
      <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
      <p>Redirecting to the homepage...</p>
    </div>
  );
};

export default OrderConfirmationPage;
