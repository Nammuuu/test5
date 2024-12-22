


"use client";

import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../components/context/AuthContext"; 
// import styles from "../../../../styles/user/ordar/Myorderr.module.css"; 
import styles from "../../../../styles/user/ordar/Myoderr.module.css"; 
import { showToast } from "../../../../components/toastUtil";
import Link from 'next/link';
import jsPDF from "jspdf"; 
import "jspdf-autotable"; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Loader from "../../../../components/Loader";
gsap.registerPlugin(ScrollTrigger);


const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState("order");
  const [showDetails, setShowDetails] = useState('order');
  const [activeButton, setActiveButton] = useState('order');
  const [loading, setLoading] = useState(false);
  const ordersRef = useRef(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch("/api/user/me/myorder", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
          // router.push("/login");
          return;
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        alert("An error occurred while fetching orders. Please try again.");
      }
      finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [router]);


  useEffect(() => {
    // GSAP Animation for orders
    const elementsToAnimate = document.querySelectorAll('.gsap-animate'); // Target elements
  
    elementsToAnimate.forEach((element, index) => {
      const animationType = index % 2 === 0 ? { x: -100 } : { x: 100 }; // Alternating left/right animation
      gsap.fromTo(
        element,
        { opacity: 0, y: 30, ...animationType }, // Initial state with alternating x-axis translation
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 2, // Slow-motion effect
          ease: "power2.out", // Smooth easing effect
          scrollTrigger: {
            trigger: element,
            start: "top 100%", // Trigger animation
            end: "top 70%",
            scrub: true, // Smooth scroll effect
            markers: false,  
          },
        }
      );
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Clean up on unmount
    };
  }, [orders]);
  useEffect(() => {
    const orderCards = document.querySelectorAll('.orderCard');
  
    orderCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse",
          once: false, 
          markers: true, 
        },
        opacity: 0,
        y: 30,
        duration: 0.5,
      });
    });
  
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [orders]);


  
  useEffect(() => {
    // GSAP Parallax Effect
    gsap.utils.toArray(".parallax").forEach((element) => {
      gsap.to(element, {
        yPercent: -30, // Slower movement than the scroll
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom", // Start when the element enters the viewport
          scrub: true, // Smooth scroll effect
        },
      });
    });
  }, []);
  
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
  
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    };
  
    window.addEventListener('scroll', animateOnScroll);
    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);
  






  const handleCancelOrder = async (orderId) => {
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/user/me/myorder/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: "Cancelled" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error cancelling order: ${errorData.message}`);
        return;
      }

      alert("Order cancelled successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling the order. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  // Invoice Generation Function
  const generateInvoice = (order) => {
    const doc = new jsPDF();

    // Add invoice header
    doc.setFontSize(18);
    doc.text("Invoice", 105, 10, null, null, "center");

    // Add order details
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 10, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 10, 40);
    doc.text(`Total Price: $${order.totalPrice}`, 10, 50);
    doc.text(`Payment Method: ${order.paymentMethod}`, 10, 60);
    doc.text(`Paid: ${order.isPaid ? "Yes" : "No"}`, 10, 70);
    doc.text(`Order Status: ${order.orderStatus}`, 10, 80);

    // Add shipping address
    doc.text("Shipping Address:", 10, 100);
    const { fullName, address, city, state, country, pinCode } = order.shippingAddress;
    doc.text(`Name: ${fullName}`, 10, 110);
    doc.text(`Address: ${address}, ${city}, ${state}`, 10, 120);
    doc.text(`Country: ${country}, Pin Code: ${pinCode}`, 10, 130);

    // Add product details as a table
    const productData = order.orderItems.map((item, index) => [
      index + 1,
      item.product.name,
      item.quantity,
      item.size || "N/A",
      item.color || "N/A",
      item.product.price,
    ]);

    doc.autoTable({
      head: [["#", "Product Name", "Quantity", "Size", "Color", "Price"]],
      body: productData,
      startY: 150,
    });

    // Save the PDF
    doc.save(`invoice_${order._id}.pdf`);
  };

  if (!orders.length) {
    return  <div className={styles.msgcontainer}>
    <h1 className={styles.noOrderMessage}>You have no orders yet.</h1>
    <Link href="/" className={styles.homeLink}>
      Start Shopping
    </Link>
  </div>
  ;
  }

 
  

  const showOrderDetails = (orderId) => {
    setSelectedOrder(orderId);
    setShowDetails("orderDetails");
    setActiveButton('orderDetails');
  };

  const showShippingDetails = (orderId) => {
    setSelectedOrder(orderId);
    setShowDetails("shippingDetails");
    setActiveButton('shippingDetails');
  };

  const loadProductDetails = (orderId) => {
    setSelectedOrder(orderId);  
    setShowDetails("order");    
    setActiveButton('order');
  };
  
  if (loading) {
    return <Loader />; 
  }


  return (
    <div className={`${styles.myOrdersContainerone} parallax gsap-animate`}>
       {loading && <Loader />}
       
    <h1 className="TypingEffect"> My Orders </h1>

    <div className={styles.myOrdersContainer}>
  {orders.map((order, index) => (
    <div
      key={order._id}
      className={`${styles.orderCard} gsap-animate ${index % 2 === 0 ? 'fade-left' : 'fade-right'}`}
      data-animate="fade-up"
    >
      <div className={styles.topBar}>
        <button
          onClick={() => loadProductDetails(order._id)}
          className={`${styles.topButton} ${activeButton === 'order' ? styles.active : ''}`}
        >
          Order
        </button>
        <button
          onClick={() => showOrderDetails(order._id)}
          className={`${styles.topButton} ${activeButton === 'orderDetails' ? styles.active : ''}`}
        >
          Order Details
        </button>
        <button
          onClick={() => showShippingDetails(order._id)}
          className={`${styles.topButton} ${activeButton === 'shippingDetails' ? styles.active : ''}`}
        >
          Shipping Details
        </button>
      </div>

      {/* Display order details */}
      {selectedOrder === order._id && showDetails === "orderDetails" && (
        <div className={`${styles.sectionorderCard} gsap-animate`} data-animate="fade-up">
          <h2>Order ID: {order._id}</h2>
          <p>Total Price: ₹{order.totalPrice}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Order Status: {order.orderStatus}</p>
          <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
          <p>Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Not Paid"}</p>
        </div>
      )}

      {/* Display shipping details */}
      {selectedOrder === order._id && showDetails === "shippingDetails" && (
        <div className={`${styles.sectionorderCard} gsap-animate`} data-animate="fade-up">
          <h2 className={`scroll-animate ${styles.subHeading}`}>Shipping Address</h2>
          <p>Full Name: <span>{order.shippingAddress.fullName}</span></p>
          <p>Address: <span>{order.shippingAddress.address}</span></p>
          <p>City: <span>{order.shippingAddress.city}</span></p>
          <p>Country: <span>{order.shippingAddress.country}</span> - PinCode: <span>{order.shippingAddress.pinCode}</span></p>
        </div>
      )}

      {/* Display order items */}
      <div className={`${styles.sectionorderCard} gsap-animate`}>
        <h3>Order Items</h3>
        {order.orderItems.map((item) => (
          <li
            key={`${order._id}-${item.product?._id}`}
            className={`gsap-animate ${styles.orderItem}`}
          >
            {item.product?.media && item.product.media.length > 0 && (
              <Image
                src={item.product.media[0]}
                alt={item.product?.name}
                className={styles.productImage}
                width={300}
                height={300}
              />
            )}
            <div>
              <p  className={styles.titlell}>{item.product?.name.length > 30 ? item.product?.name.slice(0, 30) + "..." : item.product?.name}</p>
              <p>Quantity: {item.quantity}</p>
              {item.size && <p>Size: {item.size}</p>}
              {item.color && <p>Color: {item.color}</p>}
            </div>
          </li>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={`gsap-animate ${styles.invoiceButton}`} onClick={() => generateInvoice(order)}>
          Download Invoice
        </button>
        {order.orderStatus !== "Cancelled" && (
          <button className={`gsap-animate ${styles.invoiceButton}`} onClick={() => handleCancelOrder(order._id)}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  ))}
</div>


    {/* <div  className={styles.myOrdersContainer}>
        {orders.map((order, index) => (
          <div  key={order._id} className={styles.myOrdersContainer} >
          {orders.map((order, index) => (
            <div
              key={order._id}
              className={`${styles.orderCard} gsap-animate ${index % 2 === 0 ? 'fade-left' : 'fade-right'}`} 
    
    
              data-animate="fade-up"
            > 
              <div className={styles.topBar}>
                <button
                  onClick={() => loadProductDetails(order._id)}
                  className={`${styles.topButton} ${activeButton === 'order' ? styles.active : ''}`}
                  // className={`${styles.topButton} ${activeButton === 'order' ? styles.active : ''}`}
                >
                  Order
                </button>
    
      
                <button
                  onClick={() => showOrderDetails(order._id)}
                  className={`${styles.topButton} ${activeButton === 'orderDetails' ? styles.active : ''}`}
                >
                  Order Details
                </button>
                <button
                  onClick={() => showShippingDetails(order._id)}
                  className={`${styles.topButton} ${activeButton === 'shippingDetails' ? styles.active : ''}`}
                >
                  Shipping Details
                </button>
              </div>
      
              {selectedOrder === order._id && showDetails === "orderDetails" && (
                <div className={`${styles.sectionorderCard} gsap-animate`} data-animate="fade-up">
                  <h2>Order ID: {order._id}</h2>
                  <p>Total Price: ₹{order.totalPrice}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Order Status: {order.orderStatus}</p>
                  <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
                  <p>Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Not Paid"}</p>
                  {order.coupon && order.coupon.code && order.coupon.discount && (
                    <div>
                      <p>Coupon Code: {order.coupon.code}</p>
                      <p>Discount Applied: {order.coupon.discount}%</p>
                      <p>Discounted Price: ₹{order.totalPrice}</p>
                    </div>
                  )}
                </div>
              )}
      
              {selectedOrder === order._id && showDetails === "shippingDetails" && (
                <div className={`${styles.sectionorderCard} gsap-animate`} data-animate="fade-up">
                  <h2 className={`scroll-animate ${styles.subHeading}`}>Shipping Address</h2>
                  <p className={`scroll-animate`}>Full Name: <span>{order.shippingAddress.fullName}</span></p>
                  <p className="TypingEffect">Address: <span>{order.shippingAddress.address}</span></p>
                  <p className="TypingEffect">Address2: <span>{order.shippingAddress.address2}</span></p>
                  <p>City: <span>{order.shippingAddress.city}</span></p>
                  <p>State: <span>{order.shippingAddress.state}</span></p>
                  <p>Landmark: <span>{order.shippingAddress.landmark}</span> - Phone No: <span>{order.shippingAddress.phoneNo}</span></p>
                  <p>Country: <span>{order.shippingAddress.country}</span> - PinCode: <span>{order.shippingAddress.pinCode}</span></p>
                </div>
              )}
    
            
    
              
      
              <div className={`${styles.sectionorderCard} gsap-animate`}>
                <h3>Order Items</h3>
                {order.orderItems.map((item) => (
                  <li 
                  // key={item.product?._id}
                  key={`${order._id}-${item.product?._id}`}
    
                   className={`gsap-animate ${styles.orderItem}`}>
    
                    {item.product?.media && item.product.media.length > 0 && (
                     
                      <Image
                      src={item.product.media[0]}
                      alt={item.product?.name}
                      className={styles.productImage}
                      width={300}
                height={300}
               
              />

                    )}
                    <div>
                    <p className="TypingEffect" >{item.product?.name.length > 30 ? item.product?.name.slice(0, 30) + "..." : item.product?.name}</p>
                      <p className="TypingEffect" > Quantity: {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>
                  </li>
                ))}
              </div>
    
    
             
    
    
    
      
              <div className={styles.buttons}>
                <button className={`gsap-animate ${styles.invoiceButton}`} onClick={() => generateInvoice(order)}>
                  Download Invoice
                </button>
                {order.orderStatus !== "Cancelled" && (
                  <button className={`gsap-animate ${styles.invoiceButton}`} onClick={() => handleCancelOrder(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        ))}
      </div> */}

   
  </div>
  
  );
};

export default MyOrdersPage;