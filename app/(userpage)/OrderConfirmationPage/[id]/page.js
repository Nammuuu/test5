"use client";

import React, { useEffect, useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Adjust imports as necessary
import { AuthContext } from '../../../../components/context/AuthContext'; // Adjust the path as necessary

const OrderConfirmationPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = useParams(); // Fetch the order ID from the URL parameters

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/user/product/order/orderconfirmation/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          router.push('/login');
          return;
        }

        const data = await response.json();
        setOrderDetails(data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        alert('An error occurred while fetching order details. Please try again.');
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  return (
    <div>
      <h1>Order Confirmation</h1>
      <p>Order ID: {orderDetails._id}</p>
      <p>Total Price: {orderDetails.totalPrice}</p>
      <p>Payment Method: {orderDetails.paymentMethod}</p>

      <h2>Shipping Address</h2>
      <p>{orderDetails.shippingAddress.fullName}</p>
      <p>{orderDetails.shippingAddress.address}</p>
      <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
      <p>{orderDetails.shippingAddress.country} - {orderDetails.shippingAddress.pinCode}</p>

      <h2>Order Items</h2>
<ul>
  {orderDetails.orderItems.map((item) => (
    <li key={item.product._id}>
      <p>{item.product.name} - Quantity: {item.quantity}</p>
      <p>Size: {item.size}</p> {/* Display size */}
      <p>Color: {item.color}</p> {/* Display color */}
      <p>Price: ${item.product.price}</p>
    </li>
  ))}
</ul>

    </div>
  );
};

export default OrderConfirmationPage;
