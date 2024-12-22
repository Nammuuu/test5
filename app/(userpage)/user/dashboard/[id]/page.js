// new tast 
"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaUser,  FaClipboardList, FaHeart, FaSignOutAlt, FaAddressCard, FaShoppingCart, FaHome, FaBell, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../../../../components/context/AuthContext";
import WishlistPage from "../../../../../components/product/wishlist";
import Profile from "../../../me/profile/page";
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import styles from "../../../../../styles/user/dashboard/Dashboard.module.css";
import { FiChevronDown } from "react-icons/fi";
import Cart from "../../../cart/page";
import Cartsidebar from "../../../../../components/Home/CartSidebar"
import Image from 'next/image';
import MyOrdersPage from "../../../me/myorder/page";
import Link from "next/link";
import axios from "axios";

 
gsap.registerPlugin(ScrollTrigger);

// const UserDashboard = ({order }) => {
  const UserDashboard = () => {
  const [userData, setUserData] = useState({});
  const [activeSection, setActiveSection] = useState("profile");
  const { user } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [reviews, setReviews] = useState([]);
  const router = useRouter();
  const { id } = useParams();
 
  const [formData, setFormData] = useState({
   
    themeColor: "#ffffff", 
    shopName: "",
    website: "",
    font: "Poppins", 
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("/api/admin/setting");
        if (res?.data) {
          setFormData(res.data);  // Ensure you update the formData with the correct settings
        
         
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
  
    fetchSettings();
  }, []);




 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const response = await fetch(`/api/user/dashboard/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        setUserData(data.user);
        setReviews(data.user?.reviews || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, router, id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully logged out!", {
      position: toast.POSITION.TOP_RIGHT
    });
    router.push("/login");
  };


  useEffect(() => {
    gsap.from(".mainContentt", {
      duration: 1.5,
      opacity: 0,
      y: 20,
      ease: "power3.out",
      onComplete: () => {
        gsap.to(".mainContentt", {
          opacity: 1,
          y: 0,
        });
      },
    });
  }, [activeSection]);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  return (
    <div className={styles.container}>
    
      

      {/* Sidebar */}
      <div className={styles.dashboard}>


      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
    
      
      <div className={styles.user_dashbord_logo_container}> 
        <h1> {formData?.shopName} </h1>
                {!isSidebarOpen && (
        
                    <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
                        <FaChevronRight /> 
                    </button>
              
                )
                }   
           

      <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      </div>

      <ul>


      <div className={styles.iconsContainer}>    
          <div className={styles.userProfile}>
          <Image
        src={userData?.profilePicture || "/default-profile.png"}
        alt="Profile"
        className={styles.topprofilepic}
        width={900}
        height={900}
      />     
          </div>
        </div>
      

          <li className="sidebarItem" onClick={() => { setActiveSection("home"); toggleSidebar(); }}>
          <Link  className={styles.link} href='/'>  <FaHome /> <span>Home</span> </Link>
          </li>


          <li className="sidebarItem" onClick={() => { setActiveSection("profile"); toggleSidebar(); }}>
              <FaUser /> <span>Profile</span>
          </li>
          <li className="sidebarItem" onClick={() => { setActiveSection("orders"); toggleSidebar(); }}>
              <FaClipboardList /> <span>Orders</span>
          </li>

          <li className="sidebarItem" onClick={() => { setActiveSection("penddingorders"); toggleSidebar(); }}>
          <FaClipboardList /> <span>Pandding orders</span>
      </li>

          <li className="sidebarItem" onClick={() => { setActiveSection("Wishlist"); toggleSidebar(); }}>
              <FaHeart /> <span>Wishlist</span> 
          </li>


          <li className="sidebarItem" onClick={() => { setActiveSection("Addresses"); toggleSidebar(); }}>
              <FaAddressCard /> <span>Address</span>
          </li>
          <li className="sidebarItem" onClick={() => { setActiveSection("Reviews"); toggleSidebar(); }}>
              <FaClipboardList /> <span>My Reviews</span>
          </li>
          {/* <li className="sidebarItem" onClick={() => { setActiveSection("cart"); toggleSidebar(); }}>
              <FaShoppingCart /> <span>Cart</span>
          </li> */}


          <li className="sidebarItem" onClick={() => { handleLogout(); toggleSidebar(); }}>
              <FaSignOutAlt /> <span>Logout</span>
          </li>
      </ul>
  </div>
  

        {/* Main Content */}
        <div  className={`${styles.mainContent} mainContentt`}>

        <div className={styles.topBar}>

        <button className={styles.toggleSidebarBtn} onClick={toggleSidebar}>
                            {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
            
        

      <div className={styles.searchBar}>
      <input type="text" placeholder="Search..." className={styles.searchInput} />
      <button className={styles.searchBtn}>
          <FaSearch />
      </button>
  </div>



        <div className={styles.iconsContainer}>
          <FaBell className={styles.notificationIcon} />
          <div className={styles.userProfile}>
          <Image
        src={userData?.profilePicture || "/default-profile.png"}
        alt="Profile"
        className={styles.topprofilepic}
        width={900}
        height={900}
      />
       
            <FiChevronDown className={styles.chevronIcon} />
            <div className={styles.dropdownMenu}>
              <p>{userData?.email}</p>
              <button onClick={() => setActiveSection("profile")}>My Profile</button>
              <button onClick={() => setActiveSection("orders")}>My Orders</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>

          {activeSection === "profile" && (
            <div className={styles.profileCard}>
            <div className={styles.containerprofileCard}>

              
            <Profile />
          </div> 
            </div>
          )}

          {activeSection === "orders" && (
            <div className={styles.MyOrdersPageorderCard}>
            <div className={styles.MyOrdersPagecontainerorder}>
            <MyOrdersPage />
            </div> 
            </div>
          ) }


{/* {activeSection === "penddingorders" && (
  <div className={styles.pendingOrdersContainer}>
    <h2 className={styles.pendingOrdersHeader}>Pending Orders</h2>
    {userData?.pendingOrders?.length ? (
      <ul className={styles.pendingOrdersList}>
        {userData.pendingOrders.map((order) => (
          <li key={order._id} className={styles.orderCard}>
            <div className={styles.orderInfo}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
            </div>

            <div className={styles.orderProductInfo}>
              <h3>Product Details:</h3>
              {order.orderItems.map((item) => (
                <div key={item.product._id} className={styles.orderCardpendding}>
                  <Image
                    src={item.product?.media[0] || ""}
                    alt={item.product?.name}
                    className={styles.productImage}
                    width={900}
                    height={900} 
                  />

                  <div>
                    <p>{item.product?.name.length > 15 ? item.product.name.slice(0, 15) + "..." : item.product.name}</p>
                    <p>Price: ${item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <button className={styles.viewDetailsButton}>
                    <Link className={styles.link} href="/me/myorder">View Details</Link>
                  </button>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.noOrders}>No pending orders.</p>
    )}
  </div>
)} */}



{activeSection === "penddingorders" && (
  <div className={styles.pendingOrdersContainer}>
    <h2 className={styles.pendingOrdersHeader}>Pending Orders</h2>
    {userData?.pendingOrders?.length ? (
      <ul className={styles.pendingOrdersList}>
        {userData.pendingOrders.map((order) => (
          <li key={order._id} className={styles.orderCard}>
            <div className={styles.orderInfo}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
            </div>

            <div className={styles.orderProductInfo}>
              <h3>Product Details:</h3>
              {order.orderItems.map((item) => (
                <div key={item.product?._id || item._id} className={styles.orderCardpendding}>
                  <Image
                    src={item.product?.media?.[0] || "/placeholder-image.png"}
                    alt={item.product?.name || "Product Image"}
                    className={styles.productImage}
                    width={900}
                    height={900} 
                  />

                  <div>
                    <p>{item.product?.name?.slice(0, 15) || "Unnamed Product"}...</p>
                    <p>Price: ${item.product?.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  {item.product && (
                    <button className={styles.viewDetailsButton}>
                      <Link className={styles.link} href="/me/myorder">View Details</Link>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className={styles.noOrders}>No pending orders.</p>
    )}
  </div>
)}


    {/* {activeSection === "penddingorders" && (
            <div className={styles.pendingOrdersContainer}>
              <h2 className={styles.pendingOrdersHeader}>Pending Orders</h2>
              {userData?.pendingOrders?.length ? (
                <ul className={styles.pendingOrdersList}>
                  {userData.pendingOrders.map((order) => (
                    <li key={order._id} className={styles.orderCard}>
                      <div className={styles.orderInfo}>
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Status:</strong> {order.orderStatus}</p>
                        <p><strong>Total:</strong> ${order.totalPrice}</p>
                      </div>
           
                      <div className={styles.orderProductInfo}>
                        <h3>Product Details:</h3>
                        {order.orderItems.map((item) => (
                          <div key={item.product._id} className={styles.orderCardpendding}>
                          

<Image
         src={item.product.media[0]}
         alt={item.product.name}
         className={styles.productImage}
        width={900}
        height={900}
      />

                            <div>
                            <p>{product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}</p>
                              <p>Price: ${item.product.price}</p>
                              <p>Quantity: {item.quantity}</p>
                            </div>

                            <button className={styles.viewDetailsButton}> <Link  className={styles.link} href="/me/myorder">View Details</Link> </button>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noOrders}>No pending orders.</p>
              )}
            </div>
          )} */}








          {activeSection === "Wishlist" && (
           <div className={styles.MyWishlistPage}>
            <div className={styles.MyOrdersPagecontainerorder}>
       <WishlistPage />
       </div>
      </div>
          )}



           {activeSection === "cart" && (
              <div className={styles.MyWishlistPage}>
            <div className={styles.MyOrdersPagecontainerorder}>
       {/* <Cart /> */}
       <Cartsidebar />

      

      </div>
      </div>
          )}


           {activeSection === "Addresses" && (
<div>
        <h2>Saved Addresses</h2>
        {userData?.savedShippingAddresses?.length ? (
          userData.savedShippingAddresses.map((address, index) => (
            <div key={index}>
              <p>{address.address}, 
                {address.address2},
                {address.state},
              {address.city},
              {address.country},
              {address.pinCode},
              {address.landmark},
              {address.phoneNo},
              {address.pinCode},
          
              </p>
            </div>
          ))
        ) : (
          <p>No saved addresses.</p>
        )}
      </div>

          )}


  {/* 
            {activeSection === "Reviews" && (
 <div>
        <h2>Product Reviews</h2>
        {reviews?.length ? (
          reviews.map((review, index) => (
            <div key={index}>
              <p>Review for Product: {review.product?.name || "Unnamed Product"}</p>
             <p>Rating: 
  {[...Array(review.rating)].map((_, i) => (
    <span key={i}>⭐</span> // You can replace this with any star icon
  ))}
</p>
              <p>Comment: {review.comment}</p>
              <p>Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
              {review.profilePictureImagePreview && (
              

                <Image
                src={review.profilePictureImagePreview} 
                alt="User Profile" 
                className="h-10 w-10 rounded-full" 
        width={900}
        height={900}
      />

              )}
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
          )}
         */ }


{activeSection === "Reviews" && (
  <div className={styles.reviewsContainer}>
    <h2 className={styles.reviewsTitle}>Product Reviews</h2>
    {reviews?.length ? (
      reviews.map((review, index) => (
        <div key={index} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            {/* {review.profilePictureImagePreview && (
              <Image
                src={review.profilePictureImagePreview}
                alt="User Profile"
                className={styles.profilePicture}
                width={900}
                height={900}
              />
            )} */}

{review.product.media && (
              <Image
              // src={product.media[0] || ""}
              src={review.product.media[0] || ""}
                // src={review.profilePictureImagePreview}
                alt="User Profile"
                className={styles.profilePicture}
                width={50}
                height={50}
              />
            )}

            <div>
            {/* <Link href={`/product/details/${product._id}`}> */}
            {/* <Link className={styles.link} href="/me/myorder">View Details</Link>  */}
              <p className={styles.productName}>
              {review.product?.name.length > 30 ? review.product?.name.slice(0, 30) + "..." : review.product?.name}
                {/* {review.product?.name || "Unnamed Product"} */}
              </p>
              <p className={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <p className={styles.reviewRating}>
            {[...Array(review.rating)].map((_, i) => (
              <span key={i} className={styles.star}>⭐</span>
            ))}
          </p>
          <p className={styles.reviewComment}>{review.comment}</p>
        </div>
      ))
    ) : (
      <p className={styles.noReviews}>No reviews available.</p>
    )}
  </div>
)}


        </div>
      </div>



    </div>
  );
}; 

export default UserDashboard;
