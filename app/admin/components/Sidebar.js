
// "use client"; 
// import React from "react";
// import { FaBars, FaTimes, FaTachometerAlt, FaBoxOpen, FaShoppingCart, FaChartLine, FaCog } from "react-icons/fa";
// import styles from "../../../styles/admin/Adminsidebar.module.css"; 

// const Sidebar = ({ isOpen, toggleSidebar, setCurrentSection }) => {
//   return (
    
//     <div className={`${styles.sidebarContainer} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
//       <div className={styles.header}>
//         <h1 className={`${styles.title} ${!isOpen && styles.hidden}`}>
//           Admin
//         </h1> 
//         <button onClick={toggleSidebar} className={styles.toggleButton}>
//           {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//         </button>
//       </div>
//       <nav className={styles.nav}>
//         <div onClick={() => setCurrentSection('Dashboard')} className={styles.navItem}>
//           <FaTachometerAlt size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Dashboard
//           </span>
//         </div>
//         <div onClick={() => setCurrentSection('Products')} className={styles.navItem}>
//           <FaBoxOpen size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Products
//           </span>
//         </div>
//         <div onClick={() => setCurrentSection('Orders')} className={styles.navItem}>
//           <FaShoppingCart size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Orders
//           </span>
//         </div>
//         <div onClick={() => setCurrentSection('Categories')} className={styles.navItem}>
//           <FaChartLine size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Categories
//           </span>
//         </div>

//         <div onClick={() => setCurrentSection('Settings')} className={styles.navItem}>
//           <FaCog size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Settings
//           </span>
//         </div>

//         <div onClick={() => setCurrentSection('Users')} className={styles.navItem}>
//           <FaCog size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             Users
//           </span>
//         </div>

//         <div onClick={() => setCurrentSection('Blog')} className={styles.navItem}>
//           <FaCog size={20} />
//           <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//             blog
//           </span>
//         </div>

       

//       <div onClick={() => setCurrentSection('Chat')} className={styles.navItem}>
//       <FaCog size={20} />
//       <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//      Chats
//       </span>
//     </div>


//     <div onClick={() => setCurrentSection('Components')} className={styles.navItem}>
//     <FaCog size={20} />
//     <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//     Notifications
//     </span>
//   </div>

//   <div onClick={() => setCurrentSection('Reviews')} className={styles.navItem}>
//     <FaCog size={20} />
//     <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//     Reviews
//     </span>
//   </div>


//     <div onClick={() => setCurrentSection('Pages')} className={styles.navItem}>
//       <FaCog size={20} />
//       <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
//      Page Settings 
//       </span> 
//     </div>



    


//       </nav>
//     </div>


 

 
//   );
// };
 
// export default Sidebar;


  //  {/* <div className={`${styles.sidebarContainertop} ${isOpen ? styles.sidebarOpentop : styles.sidebarClosedtop}`}>
  //     <div className={styles.headertop}>
  //       <h1 className={`${styles.titletop} ${!isOpen && styles.hiddentop}`}>
  //         Admin
  //       </h1> 

  //       <button onClick={toggleSidebar} className={styles.toggleButtontop}>
  //         {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
  //       </button>
  //       <h1 className={`${styles.titletop} ${!isOpen && styles.hiddentop}`}>
  //         Admin
  //       </h1> 
  //       <h1 className={`${styles.titletop} ${!isOpen && styles.hiddentop}`}>
  //         Admin
  //       </h1> 
  //       <h1 className={`${styles.titletop} ${!isOpen && styles.hiddentop}`}>
  //         Admin
  //       </h1> 

  //     </div>

  //     <nav className={styles.nav2}>
  //       <div onClick={() => setCurrentSection('Dashboard')} className={styles.navItem2}>
  //         <FaTachometerAlt size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Dashboard
  //         </span>
  //       </div>
  //       <div onClick={() => setCurrentSection('Products')} className={styles.navItem2}>
  //         <FaBoxOpen size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Products
  //         </span>
  //       </div>
  //       <div onClick={() => setCurrentSection('Orders')} className={styles.navItem2}>
  //         <FaShoppingCart size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Orders
  //         </span>
  //       </div>
  //       <div onClick={() => setCurrentSection('Categories')} className={styles.navItem2}>
  //         <FaChartLine size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Categories
  //         </span>
  //       </div>

  //       <div onClick={() => setCurrentSection('Settings')} className={styles.navItem2}>
  //         <FaCog size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Settings
  //         </span>
  //       </div>

  //       <div onClick={() => setCurrentSection('Users')} className={styles.navItem2}>
  //         <FaCog size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           Users
  //         </span>
  //       </div>

  //       <div onClick={() => setCurrentSection('Blog')} className={styles.navItem2}>
  //         <FaCog size={20} />
  //         <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //           blog
  //         </span>
  //       </div>

       

  //     <div onClick={() => setCurrentSection('Chat')} className={styles.navItem2}>
  //     <FaCog size={20} />
  //     <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //    Chats
  //     </span>
  //   </div>


  //   <div onClick={() => setCurrentSection('Components')} className={styles.navItem2}>
  //   <FaCog size={20} />
  //   <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //   Notifications
  //   </span>
  // </div>

  // <div onClick={() => setCurrentSection('Reviews')} className={styles.navItem2}>
  //   <FaCog size={20} />
  //   <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //   Reviews
  //   </span>
  // </div>


  //   <div onClick={() => setCurrentSection('Page')} className={styles.navItem2}>
  //     <FaCog size={20} />
  //     <span className={`${styles.navIcon2} ${!isOpen && styles.hiddentop}`}>
  //    Page Settings 
  //     </span>
  //   </div>



    


  //     </nav>
  //   </div> */}



// "use client";
// import React, { useState } from "react";
// import {
//   FaBars,
//   FaTimes,
//   FaTachometerAlt,
//   FaBoxOpen,
//   FaShoppingCart,
//   FaChartLine,
//   FaCog,
//   FaUser,
//   FaPenAlt,
//   FaComments,
//   FaBell,
//   FaClipboard,
// } from "react-icons/fa";
// import styles from "../../../styles/admin/Adminsidebar.module.css";

// const Sidebar = ({ isOpen, toggleSidebar, setCurrentSection }) => {
 
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const navItems = [
//     { label: "Dashboard", icon: <FaTachometerAlt />, section: "Dashboard" },
//     { label: "Products", icon: <FaBoxOpen />, section: "Products" },
//     { label: "Orders", icon: <FaShoppingCart />, section: "Orders" },
//     { label: "Categories", icon: <FaChartLine />, section: "Categories" },
//     { label: "Users", icon: <FaUser />, section: "Users" },
//     { label: "Blog", icon: <FaPenAlt />, section: "Blog" },
//     { label: "Chat", icon: <FaComments />, section: "Chat" },
//     { label: "Notifications", icon: <FaBell />, section: "Components" },
//     { label: "Reviews", icon: <FaClipboard />, section: "Reviews" },
//     { label: "Settings", icon: <FaCog />, section: "Settings" },
//     { label: "Page Settings", icon: <FaCog />, section: "Pages" },
//   ];


//   const handleMobileSidebarToggle = () => {
//     setMobileSidebarOpen(!mobileSidebarOpen);
//   };

//   return (
//     <div
//       className={`${styles.sidebarContainer} ${
//         isOpen ? styles.sidebarOpen : styles.sidebarClosed
//       }`}
//     >
//       <div className={styles.header}>

//         <h1 className={`${styles.title} ${!isOpen && styles.hidden}`}>
//           Admin
//         </h1>


//         <button onClick={toggleSidebar} className={styles.toggleButton}>
//           {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//         </button>
//       </div>
     
     
      // <nav className={styles.nav}>
      //   {navItems.map((item, index) => (
      //     <div
      //       key={index}
      //       onClick={() => setCurrentSection(item.section)}
      //       className={styles.navItem}
      //     >
      //       {item.icon}
      //       <span className={`${styles.navIcon} ${!isOpen && styles.hidden}`}>
      //         {item.label}
      //       </span>
      //     </div>
      //   ))}
      // </nav>
//     </div>
//   );
// };

// export default Sidebar;




"use client";

import Link from 'next/link';
import {  useCallback, useEffect, useState, useRef } from 'react';
import axios from "axios";
import { useRouter, usePathname  } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import { 
   TbX, TbHeart, 
   TbShoppingBag,
    TbHome, TbSearch,
     TbUser,
    
     TbDashboard,
     TbShoppingBagCheck,
     TbCategory,
     TbUserHeart,
     TbPencilCheck,
     TbBellCode,
     TbClipboardCheck,
     TbEdit,
     TbMessages,
     TbPageBreak,
     TbSettings,

    } from "react-icons/tb";

import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaChartLine,
  FaCog,
  FaUser,
  FaPenAlt,
  FaComments,
  FaBell,
  FaClipboard,
} from "react-icons/fa";

// import styles from '../styles/components/Nav2.module.css';
import styles from "../../../styles/admin/Adminsidebar.module.css";



import CartSidebar from "../../../components/Home/CartSidebar";
import WishlistSidebar from "../../../components/Home/WishlistSidebar";
import Auth from "../../../app/(auth)/autth"
import Loader from "../../../components/Loader"


const Navbar = ({ isOpen, toggleSidebar, setCurrentSection }) => {
 

  
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistUpdated, setWishlistUpdated] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  // let lastScrollY = 0;
  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);
  const [loadingTimeout, setLoadingTimeout] = useState(null); // To control the loading timeout
  
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const [prevPathname, setPrevPathname] = useState(pathname);

  const [formData, setFormData] = useState({
   
    themeColor: "#ffffff", 
    shopName: "",
    website: "",
    font: "Poppins", 
    address: "",
    postCode: "",
    contact: "",
    email: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",

  });
  
  

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navItems = [
    { label: "Dashboard", icon: <TbDashboard />, section: "Dashboard" },
    { label: "Products", icon: <FaBoxOpen />, section: "Products" },
    { label: "Orders", icon: <TbShoppingBagCheck />, section: "Orders" },
    { label: "Categories", icon: <TbCategory />, section: "Categories" },
    { label: "Users", icon: <TbUserHeart />, section: "Users" },
    { label: "Blog", icon: <TbPencilCheck />, section: "Blog" },
    { label: "Chat", icon: <TbMessages />, section: "Chat" },
    { label: "Notifications", icon: <TbBellCode />, section: "Components" },
    { label: "Reviews", icon: <TbClipboardCheck />, section: "Reviews" },
    { label: "Settings", icon: <TbSettings />, section: "Settings" },
    { label: "Edit Home", icon: <TbEdit />, section: "Home" },
    { label: "Page Settings", icon: <TbPageBreak />, section: "Pages" },
  ];

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


  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
  //   const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  //   setCartItems(storedCart);
  //   setWishlistItems(storedWishlist);
  //   setWishlistUpdated(storedWishlist);

  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setUser(decoded);
  //       setUserId(decoded.userId);
  //     } catch (error) {
  //       console.error('Failed to decode token:', error);
  //     }
  //   }
  // }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
    router.push('/login');
  };

 

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
    // Check here if the state changes are affecting loader visibility
};



 

  const handleScroll = useCallback(() => {
    if (window.scrollY > lastScrollY.current) {
      // Scrolling down
      setShowNavbar(false);
    } else {
      // Scrolling up
      setShowNavbar(true);
    }
    lastScrollY.current = window.scrollY; // Update the ref value
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
  

// Handler for link clicks
const handleLinkClick = (link) => {
  if (link === pathname) {
    console.log("Same page click, no loader.");
    return; // Don't trigger loading for the same page
  }
  
  console.log(`Navigating to ${link}`);
  setIsLoading(true);
  router.push(link); // Change route using Next.js router
};


// Effect to track pathname changes for loading state
useEffect(() => {
  // Whenever the pathname changes, we set loading to true
  const handlePathChange = () => {
    setIsLoading(true);
  };

  // Set loading to false after navigating
  const handlePathChangeComplete = () => {
    console.log("Route change completed");
    setIsLoading(false);
  };

  // Listen to pathname changes
  handlePathChange();

  // You can use a small timeout to simulate the completion of loading
  const timeout = setTimeout(() => {
    handlePathChangeComplete();
  }, 500); // Adjust the timeout based on your loading needs

  // Clean up timeout on component unmount
  return () => {
    clearTimeout(timeout);
  };
}, [pathname]); // Run effect on pathname change


  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <>
   

      <nav className={`${styles.navbar} ${showNavbar ? styles.show : styles.hide}`}ref={navbarRef} >
        {/*  <nav className={styles.navbar}> Hamburger menu and Logo */}
        <div className={styles.navbarHeader}>
          
       

        <div className={styles.hamburger} onClick={toggleMenu}>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>

            

          </div>

          <div className={styles.close_logo_container}>
                <div className={styles.logo}>
                <Link href="/" className="MainColor" onClick={() => handleLinkClick("/")}>{formData?.shopName}</Link>
               </div>

          <div className={styles.navIcons}>
            <li >
              <Link onClick={() => handleLinkClick("/search")} href="/search">
              <TbSearch  className={styles.icon} />
              </Link>
            </li>

            


         



         



            <li className={styles.mediadisplaynone} >

          
              {user ? (


                <Link href={`/user/dashboard/${userId}`} onClick={() => handleLinkClick(`/user/dashboard/${userId}`)}><div className={`${styles.loginLink} ${styles.userActive}`}>
                  <div className={styles.userContainer}>

                  <TbUser className={`${styles.icon} ${styles.userActive}`} />
                    <span className={styles.activeDot}></span>
                  </div>
                </div>

                </Link>


              ) : (

                <div className={`${styles.loginLink} ${styles.userActive}`}>
                  <div className={styles.userContainer}>

                  <Auth className={`${styles.icon} ${styles.userActive}`} />

                  </div>
                </div>






              )}
            </li>
          </div>

          </div>


        </div>
        </nav>




        {/* Full screen side panel (opens left to right) 
          <div className={`${styles.sidePanel} ${menuOpen ? styles.open : ''}`}>
           */}
           <div className={`${styles.sidePanel} ${menuOpen ? styles.open : ''}`}>


          <div className={styles.mobnavbarHeader}>

            <div className={styles.moblogo}>
              <Link className="MainColor" onClick={() => handleLinkClick("/")} href="/">{formData?.shopName}</Link>
            </div>

            <button className={`${styles.closeBtn} ${styles.navButton}`} onClick={toggleMenu}><TbX  /> </button>

          </div>



          <ul className={styles.navItems}>
           
              <li>
            <Link className={styles.homelinksidebar} href="/" onClick={() => handleLinkClick("/")}>
           <div className={styles.TbHome} > <TbHome /> </div>   Home
            </Link>
          </li>

                 <ul className={styles.navUl}>
        {navItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setCurrentSection(item.section)}
            className={styles.navItemadmin}
          >
            
            <li className={`${styles.navIcons} ${!isOpen && styles.hidden}`}>
            {item.icon}  {item.label}
            </li>
          </div>
        ))}
      </ul>

           {user && (
              <>
                {user.role === 'admin' && (
                  <>
                    <li><Link onClick={() => handleLinkClick("/admin/dashboard")} href="/admin/dashboard">Admin Dashboard</Link></li>
                   
                  </>
                )}
        
                 

                <li><button className={`${styles.signOutx} ${styles.navButtonx}`} onClick={handleSignOut}>Logout</button></li>
              </>
            )}
          </ul>
        </div>

        {/* Bottom navigatio */}
        <div className={styles.mobileBottomNav}>

         

         

          <Link onClick={() => handleLinkClick("/")} href="/">
          <TbHome />
          <span> Home </span> </Link>

          <Link onClick={() => handleLinkClick("/category")} href="/category"> <TbCategory /> 
          <span>Categories</span> </Link>


         

         

        <Link onClick={() => handleLinkClick("/search")} href="/search">
         <TbSearch /> 
         <span> Search </span>
        </Link>




          {user ? 
            <Link onClick={() => handleLinkClick(`/user/dashboard/${userId}`)} href={`/user/dashboard/${userId}`}>
            <Link href={`/user/dashboard/${userId}`}>

            <div className={`${styles.loginLink} ${styles.userActive}`}>
              <div className={styles.userContainer}>

                <TbUser className={`${styles.icon} ${styles.userActive}`} />

             
               <span> Admin </span>
              </div>
              
            </div>

            </Link>


          </Link> :

            <div className={`${styles.loginLink} ${styles.userActive}`}>
              <div className={styles.userContainer}>

              <Auth className={`${styles.icon} ${styles.userActive}`} />
                <span className={styles.activename} >Admin</span>
              </div>
            </div>
          }


        </div>
     

      {isLoading && <div className="loader"><Loader /></div>}
    
     </>
  );

};

export default Navbar;
