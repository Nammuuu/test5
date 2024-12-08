

"use client";

import Link from 'next/link';
import {  useCallback, useEffect, useState, useRef } from 'react';

import axios from "axios";

import { useRouter, usePathname  } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart, FaHeart, FaTimes, FaSearch,  FaHome, FaUser, FaBars, FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { TbCategory, TbX, TbHeart, TbShoppingBag, TbHome, TbSearch, TbUser } from "react-icons/tb";
import styles from '../styles/components/Nav2.module.css';
import CartSidebar from "./Home/CartSidebar";

import WishlistSidebar from "./Home/WishlistSidebar";

import Auth from "../app/(auth)/autth"
import Loader from "../components/Loader"

const Navbar = () => {
 

  
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
    const token = localStorage.getItem('token');
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
    setWishlistUpdated(storedWishlist);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setUserId(decoded.userId);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.reload();
    router.push('/login');
  };

  // const toggleMenu = () => {
  //   setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  // };

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
    // Check here if the state changes are affecting loader visibility
};


  const viewCart = () => {
    setSidebarOpen(true);  // Open the sidebar when the cart button is clicked
  };

  const wislistopen = () => {
    setIsWishlistOpen(true);
  }

  const closeSidebar = () => {
    setSidebarOpen(false);  // Close the sidebar
  };


  // navbar scrolll 

  // const handleScroll = useCallback(() => {
  //   if (window.scrollY > lastScrollY) {
  //     // Scrolling down
  //     setShowNavbar(false);
  //   } else {
  //     // Scrolling up
  //     setShowNavbar(true);
  //   }
  //   lastScrollY = window.scrollY;
  // },[lastScrollY]);

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll]);


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
            <li className={styles.mediadisplaynone} >
              <Link onClick={() => handleLinkClick("/search")} href="/search">
              <TbSearch  className={styles.icon} />
              </Link>
            </li>

            


          <li>
          <button onClick={wislistopen} className={`${styles.cartButtonx} ${styles.navButton}`}>

          <TbHeart className={styles.icon} />
            
            <span className={styles.cartCount}>{wishlistItems.length}</span>
          </button>

          {/* Sidebar component */}
          
        


        </li>



            <li>
              <button onClick={viewCart} className={`${styles.cartButtonx} ${styles.navButton}`}>

              <TbShoppingBag className={styles.icon} />
             
                <span className={styles.cartCount}>{cartItems.length}</span>
              </button>

              {/* Sidebar component */}
             



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


         

            {/*   <li>
              <Link href="/search"><FaSearch /> Search</Link>
            </li>
            <li>
              <Link href="/wishlist"><FaHeart /> Wishlist ({wishlistItems.length})</Link>
            </li>
            <li>
              <button onClick={viewCart} className={styles.cartButton}><FaShoppingCart /> Cart ({cartItems.length})</button>
            </li>
            */}


            <li>
            <Link href="/" onClick={() => handleLinkClick("/")}>
              Home
            </Link>
          </li>

            {/* If user is logged in */}
            {user && (
              <>

              
            


<li>{userId ? <Link  onClick={() => handleLinkClick(`/user/dashboard/${userId}`)}  href={`/user/dashboard/${userId}`} >Profile</Link> : 'Loading...'}</li>

                {/* <li><Link href="/me/profile" onClick={() => handleLinkClick("/me/profile")}>Profile</Link></li> */}
                <li><Link href="/me/myorder" onClick={() => handleLinkClick("/me/myorder")}>My Order</Link></li>

                
                <li>{userId ? <Link  onClick={() => handleLinkClick(`/user/dashboard/${userId}`)}  href={`/user/dashboard/${userId}`} >Dashboard</Link> : 'Loading...'}</li>

              </>
            )}



             <li><Link href="/product" onClick={() => handleLinkClick("/product")}>Produts</Link></li>
            <li><Link href="/category" onClick={() => handleLinkClick("/category")}>Categorys</Link></li>

            <li> <Link onClick={() => handleLinkClick("/wishlist")} href="/wishlist"> My wishlist </Link></li>



           
           


            <li> <Link onClick={() => handleLinkClick("/offers")} href="/offers">Offers </Link></li>
            <li> <Link onClick={() => handleLinkClick("/faq")} href="/faq">FAQ </Link></li>
         
            <li> <Link onClick={() => handleLinkClick("/Shipping")} href="/Shipping">Shipping</Link></li>


         
            <li> <Link onClick={() => handleLinkClick("/AboutUs")}  href="/AboutUs"> About Us</Link></li>
            <li> <Link  onClick={() => handleLinkClick("/ContactUs")} href="/ContactUs">Contact Us</Link></li>


            
           
            <li><Link onClick={() => handleLinkClick("/blog")} href="/blog">Blogs</Link></li>
            

            <li> <Link onClick={() => handleLinkClick("/CookiesPolicy")}  href="/CookiesPolicy">Cookies Policy</Link></li>
            <li> <Link onClick={() => handleLinkClick("/TermsConditions")}  href="/TermsConditions">Terms & Conditions</Link></li>
            <li> <Link  onClick={() => handleLinkClick("/privacy")}  href="/privacy">Privacy Policy</Link></li>
            <li> <Link onClick={() => handleLinkClick("/ReturnExchange")} href="/ReturnExchange">Return & Exchange</Link></li>
            


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



            {/* If user is not logged in */}
            {!user && (
              <>
              <li><button  className={`${styles.signOutx} ${styles.navButtonx}`}> Register </button></li>
                  <li ><button className={`${styles.signOutx} ${styles.navButtonx}`}> Login </button></li>
              </>
            )}



           


    


         <div className={styles.about}>
          <h4>Contact</h4>

            
            <li>
           Address:  {formData?.address}
            {formData?.postCode}
            
            </li>
            <li>Email: {formData?.email} </li>
            <li>Phone: {formData?.contact}</li>
          
        </div>

        
        <div className={styles.icons}>
  <Link 
    onClick={() => handleLinkClick(formData?.facebook || '#')} 
    href={formData?.facebook || '#'}
  >
    <FaFacebook />
  </Link>
  <Link 
    onClick={() => handleLinkClick(formData?.instagram || '#')} 
    href={formData?.instagram || '#'}
  >
    <FaInstagram />
  </Link>
  <Link 
    onClick={() => handleLinkClick(formData?.twitter || '#')} 
    href={formData?.twitter || '#'}
  >
    <FaTwitter />
  </Link>
  <Link 
    onClick={() => handleLinkClick(formData?.youtube || '#')} 
    href={formData?.youtube || '#'}
  >
    <FaYoutube />
  </Link>
</div>




    <div className={styles.copyright}>
      <p>© copyright by {formData?.shopName}, All Rights Reserved</p>
    </div>


          </ul>
        </div>

        {/* Bottom navigatio */}
        <div className={styles.mobileBottomNav}>

         

         

          <Link onClick={() => handleLinkClick("/")} href="/">
          <TbHome />
          <span> Home </span> </Link>

          <Link onClick={() => handleLinkClick("/category")} href="/category"> <TbCategory /> 
          <span>Categories</span> </Link>


          <button onClick={viewCart} className={`${styles.cartButtonmob} ${styles.navButton} ${styles.homeicon}`} >
            <TbShoppingBag className={styles.mainiconmob} />
            <span className={styles.cartCountmob}>{cartItems.length}</span>
            
          </button>

         

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

             
               <span> Profile </span>
              </div>
              
            </div>

            </Link>


          </Link> :

            <div className={`${styles.loginLink} ${styles.userActive}`}>
              <div className={styles.userContainer}>

              <Auth className={`${styles.icon} ${styles.userActive}`} />
                <span className={styles.activename} >Log-in</span>
              </div>
            </div>
          }


        </div>
     
       <WishlistSidebar isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} wishlistUpdated={wishlistUpdated} />

      <CartSidebar isOpen={isSidebarOpen} onClose={closeSidebar} cartUpdated={cartUpdated} />
      {isLoading && <div className="loader"><Loader /></div>}
    
     </>
  );

};

export default Navbar;
