
// "use client";
"use client";



import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// import styles from '../../../../../styles/product/ProductDetails.module.css';
import styles from '../../../../../styles/product/productde.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { FaStar, FaHome, FaAngleRight, FaFacebookF, FaTwitter, FaCopy, FaArrowLeft, FaArrowRight, FaLinkedinIn, FaShareAlt, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link'
import Image from 'next/image';
import CartSidebar from '../../../../../components/Home/CartSidebar';
import { IoIosArrowBack } from "react-icons/io";
import { TbHeart, TbShoppingBag,  } from "react-icons/tb";
import Loader from "../../../../../components/Loader";
const ProductDetailsPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  // const [selectedColor, setSelectedColor] = useState('');
  // const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
const [selectedSize, setSelectedSize] = useState(null);

// Add logic to handle color and size selection

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [userId, setUserId] = useState('');
  const [profilePictureImagePreview, setProfilePictureImagePreview] = useState('');
  const [recommendedProducts, setrecommendedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const router = useRouter();
  const { id } = params;
  const [activeTab, setActiveTab] = useState('details');
  const [sharePopupOpen, setSharePopupOpen] = useState(false);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [activeThumbnail, setActiveThumbnail] = useState(0);


  const [isCartOpen, setIsCartOpen] = useState(false); // Control cart visibility
const [cartUpdated, setCartUpdated] = useState(false);



  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/user/product/productdetails/${id}`);
          setProduct(response.data.product);
          if (response.data.product.media.length > 0) {
            // setMainImage(response.data.product.media[0]);
            setMainImageIndex(0);
          }
        } catch (error) {
          setError('Failed to fetch product details');
        } finally {
          setLoading(false);
        } 
      };
      fetchProduct();
    }
  }, [id]);


  

 
  // Function to handle share actions
  const handleShare = (platform) => {
    const url = window.location.href; // URL of the current product page
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(product.name)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(product.name)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=Check out this product: ${encodeURIComponent(product.name)} - ${encodeURIComponent(url)}`;
        break;

      default:
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyUrl = () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/product/details/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Product URL copied to clipboard!'))
      .catch((error) => toast.error('Failed to copy URL.'));
  };




  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await axios.get('/api/user/product/home');
        setrecommendedProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch recommended products', error);
        toast.error('Error fetching recommended products.');
      }
    };
    fetchRecommendedProducts();
  }, []);

  const trimText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...'; // Append ellipsis if trimmed
    }
    return text;
  };
  



  // const handleAddToCart = () => {
  //   if (!product) return;


  //   // if (!selectedColor && product.colors.length > 0) {
  //   //   toast.error('Please select a color.');
  //   //   return;
  //   // }
  //   // if (!selectedSize && product.sizes.length > 0) {
  //   //   toast.error('Please select a size.');
  //   //   return;
  //   // }

  //   if (product.colors.length > 0 && !selectedColor) {
  //     toast.error('Please select a color.');
  //     return;
  //   }
  //   if (product.sizes.length > 0 && !selectedSize) {
  //     toast.error('Please select a size.');
  //     return;
  //   }


  //   setIsAddingToCart(true); // Disable button while adding

  //   // let cart = JSON.parse(localStorage.getItem('cart')) || [];

  //   // Add logic here for checking and adding item to cart
  //   if (!product) return;

  //   // Check if the product has color or size options
  //   if (product.colors.length > 0 && !selectedColor) {
  //     toast.error('Please select a color.');
  //     return;
  //   }

  //   if (product.sizes.length > 0 && !selectedSize) {
  //     toast.error('Please select a size.');
  //     toast.error('Please select a color.');
  //     return;
  //   }

  //   if (product.sizes.length > 0 && !selectedSize) {
  //     toast.error('Please select a size.');
  //     return;
  //   }

  //   let cart = JSON.parse(localStorage.getItem('cart')) || [];

  //   // Check if the product already exists with the same color and size (if applicable)
  //   const existingItem = cart.find(item =>
  //     item._id === product._id &&
  //     (!product.colors.length || item.selectedColor === selectedColor) &&
  //     (!product.sizes.length || item.selectedSize === selectedSize)
  //   );

  //   if (existingItem) {
  //     // Increment quantity if product with same color and size is already in the cart
  //     existingItem.quantity += 1;
  //     toast.info(`${product.name} quantity increased in cart.`);
  //   } else {
  //     // Add new item to cart
  //     const newItem = { ...product, quantity: 1 };
  //     if (product.colors.length > 0) newItem.selectedColor = selectedColor;
  //     if (product.sizes.length > 0) newItem.selectedSize = selectedSize;

  //     cart.push(newItem);
  //     toast.success(`${product.name} added to cart`);
  //   }

  //   localStorage.setItem('cart', JSON.stringify(cart));

  //   setIsAddingToCart(false); // Enable button after adding
  // };


  const handleAddToCart = () => {
    if (!product) return;

    if (product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color.');
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size.');
      return;
    }

    setIsAddingToCart(true);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingItem = cart.find(
      (item) =>
        item._id === product._id &&
        (!product.colors.length || item.selectedColor === selectedColor) &&
        (!product.sizes.length || item.selectedSize === selectedSize)
    );

    if (existingItem) {
      existingItem.quantity += 1;
      toast.info(`${product.name} quantity increased in cart.`);
    } else {
      const newItem = { ...product, quantity: 1 };
      if (product.colors.length > 0) newItem.selectedColor = selectedColor;
      if (product.sizes.length > 0) newItem.selectedSize = selectedSize;

      cart.push(newItem);
      toast.success(`${product.name} added to cart`);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartUpdated(!cartUpdated); // Trigger cart update
    setIsCartOpen(true); // Open the cart sidebar after adding item
    setIsAddingToCart(false);
  };


  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const existingItem = wishlist.find(item => item._id === product._id);
    if (!existingItem) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast.success(`${product.name} added to wishlist`);
    } else {
      toast.info(`${product.name} is already in your wishlist`);
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found.');
        return;
      }
      try {
        const response = await axios.get(`/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.get(`/api/user/me/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfilePictureImagePreview(response.data.profilePicture || '');
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      fetchUserProfile();
    }
  }, [userId]);


  // Handle submitting a review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to submit a review.');
      router.push('/login');
      return;
    }


    if (!rating || !review) {
      toast.error('Please provide a rating and a comment.');
      return;
    }

    // Set a default image URL if profilePictureImagePreview is null or empty
    const defaultProfileImageUrl = 'https://res.cloudinary.com/dp7anotjs/image/upload/v1725207610/profile_images/xoy2ncbn652knmfbsymm.jpg';
    const profilePictureToSend = profilePictureImagePreview || defaultProfileImageUrl;

    try {
      const response = await axios.post(
        `/api/user/${id}/review`,
        {
          productId: product._id,
          // profilePictureImagePreview: profilePictureImagePreview,
          profilePictureImagePreview: profilePictureToSend,
          rating,
          comment: review,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Review added successfully") {
        toast.success('Review submitted successfully!');
        // Optionally, you can fetch the product details again to update the reviews
        // const updatedProduct = await axios.get(`/api/user/product/productdetails/${id}`);
        const updatedProduct = await axios.get(`/api/user/${id}/review`);
        // const updatedProduct = await axios.get(`/api/user/product/productdetails/${id}`);

        setProduct(updatedProduct.data.product);
        setReview('');
        setRating(0);
        setProfilePictureImagePreview('')

      } else {

        toast.error('Failed to submit review.');
      }
    } catch (error) {

      toast.error('Error submitting review. plase login and try again');
      router.push('/login');
    }
  };
 
  const fetchProductReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/user/${id}/review`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product reviews:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProductReviews();
  }, [fetchProductReviews]);


// Function to handle left arrow click (Previous Image)
const handlePrevImage = () => {
  setMainImageIndex((prevIndex) =>
    prevIndex === 0 ? product.media.length - 1 : prevIndex - 1
  );
};

// Function to handle right arrow click (Next Image)
const handleNextImage = () => {
  setMainImageIndex((prevIndex) =>
    prevIndex === product.media.length - 1 ? 0 : prevIndex + 1
  );
};

const handleThumbnailClick = (index) => {
  setActiveThumbnail(index); // Set the active thumbnail when clicked
};

const productNameTrim = (name) => {
  return name.length > 18 ? name.substring(0, 18) + '...' : name;
};




  if (loading) return <div> <Loader /></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.productDetails}>
       {loading && <Loader />}
      {product ? (
        <>

        <div className={styles.url}>
        <Link href="/">
         
          Home <FaAngleRight className={styles.homeIcon} />
        </Link>
        
        <Link href="/">{product?.categoryName}
        <FaAngleRight className={styles.homeIcon} />
        </Link>
        
       
        <Link href="/">{product && productNameTrim(product.name)}</Link>
      </div>

          <div className={styles.imageGallery}>



            <div className={styles.imageGalleryContianer}>

              {product.media.map((url, index) => (
               
               <Image
               key={index}
               src={url}
               alt={`Thumbnail ${index + 1}`}
                        width={900}
                        height={900}
                       
                        priority
                        onClick={() => {
                          setMainImageIndex(index); // Change the main image on click
                          handleThumbnailClick(index); // Mark the clicked thumbnail as active
                        }}
                        className={`${styles.thumbnail} ${activeThumbnail === index ? styles.activeThumbnail : ''}`}
                      />
                      
      //                 <img
      //             key={index}
      //             src={url}
      //             alt={`Thumbnail ${index + 1}`}
      //             onClick={() => {
      //   setMainImageIndex(index); // Change the main image on click
      //   handleThumbnailClick(index); // Mark the clicked thumbnail as active
      // }}
      // className={`${styles.thumbnail} ${activeThumbnail === index ? styles.activeThumbnail : ''}`}
      //           />
              ))}



            </div>

           

            <div className={styles.thumbnailContainer}>
            <button className={`${styles.arrowButton} ${styles.left}`} onClick={handlePrevImage}>
              <FaArrowLeft size={20} />
            </button>
            
            <Image
                        src={product.media[mainImageIndex]} alt={product.name} className={styles.mainImage} 

                        width={900}
                        height={900}
                       
                        priority
                      />

          
            <button className={`${styles.arrowButton} ${styles.right}`} onClick={handleNextImage}>
              <FaArrowRight size={20} />
            </button>
          </div>
          






            <div className={styles.productcontent}>
              <h1>{product.name}</h1>


              <div className={styles.rating}>
                <h3>Rating: {calculateAverageRating(product.reviews)}</h3>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={20}
                    fill={index + 1 <= calculateAverageRating(product.reviews) ? '#ffc107' : '#e4e5e9'}
                    // color={index + 1 <= calculateAverageRating(product.reviews) ? '#ffc107' : '#e4e5e9'}
                  />
                ))}
              </div>

              <div className={styles.productpricecontent}>

<p className={styles.Discount}> <span  className={styles.price}>₹{product.price}.00</span> <span className={styles.Discountprce}>₹{product.discountPrice}</span></p>


{/* <p className={styles.Discount}> Price: <span>${product.discountPrice}</span></p>
<p className={styles.price}> Discount Price: <span>${product.price}</span></p>
*/}

</div>



   <div className={styles.line}></div>

              {product.colors.length > 0 && (
                <div className={styles.options}>
                  <h3>Color :</h3>
                  <div className={styles.optionsContainer}>
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className={`${styles.optionButton} ${color === selectedColor ? styles.selected : ''}`}
                        // {/* className={color === selectedColor ? styles.selected : ''} */}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div className={styles.options}>
                  <h3>Size :</h3>
                  <div className={styles.optionsContainer}>
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        className={`${styles.optionButton} ${size === selectedSize ? styles.selected : ''}`}
                        // className={size === selectedSize ? styles.selected : ''}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.materials.length > 0 && (
                <div className={styles.options}>
                  <h3>Material :</h3>
                  <div className={styles.optionsContainer}>
                    {product.materials.map((materials, index) => (
                      <button
                        key={index}
                        className={`${styles.optionButton} ${materials === selectedSize ? styles.selected : ''}`}
                        // className={size === selectedSize ? styles.selected : ''}
                        onClick={() => setSelectedSize(materials)}
                      >
                        {materials}
                      </button>
                    ))}
                  </div>
                </div>
              )}


<div className={styles.line}></div>

{/* <div className={styles.productpricecontent}>
<p className={styles.stock} >
  Limited Stock : 
  <span>{product.stock}</span></p>
   </div> */}

              <div className={styles.actions}>
              
                <button onClick={handleAddToCart} className={styles.cartButton}> <TbShoppingBag /> Add to Cart</button>
                <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartUpdated={cartUpdated} />
                <button onClick={handleAddToWishlist} className={styles.wishlistButton}> <TbHeart /> Add to Wishlist</button>
              </div>


              <div className={styles.line}></div>
            </div>

          </div>



          <div className={styles.productContainer}>
          {/* Tab buttons */}
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
             Details
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'tags' ? styles.active : ''}`}
              onClick={() => setActiveTab('tags')}
            >
              Tags
            </button>

            <button
            className={`${styles.tabButton} ${activeTab === 'Return' ? styles.active : ''}`}
            onClick={() => setActiveTab('Return')}
          >
          Shipping & Return
          </button>

          </div>
    
          <div className={styles.line}></div>

          
          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'details' && (
              <div className={styles.productDescriptionContainer}>
                <h1  className={styles.productheadingdetails}> Product Details </h1>
                <p className={styles.productDescription}>{product.description}</p>
              </div>
            )}
    
            {activeTab === 'reviews' && (
              <div className={styles.reviews}>
                <h1 className={styles.productheadingdetails}>Product Reviews </h1>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev, index) => (
                    <div key={index} className={styles.review}>
                      <div className={styles.reviewHeader}>
                       

                   <Image
                      src={rev.profilePictureImagePreview || '/default-profile.png'}
                      alt={rev.user ? rev.user.username : 'Anonymous'}
                      className={styles.thumbnailreview}
                        width={950}
                        height={950}
                       
                        priority
                      />

                        <strong>{rev.user ? rev.user.username : 'Anonymous'}</strong>
                        {[...Array(5)].map((_, starIndex) => (
                          <FaStar
                            key={starIndex} 
                            size={20}
                            color={starIndex + 1 <= rev.rating ? '#ffc107' : '#e4e5e9'}
                          />
                        ))}
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p>{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}

                <div className={styles.reviewSection}>
                <h3>Leave a Review:</h3>
                <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                  <div className={styles.ratingInput}>
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            className={styles.radioInput}
                          />
                          <FaStar
                            size={30} // Increased star size for better visibility
                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                            className={styles.starIcon} // New class for styling
                          />
                        </label>
                      );
                    })}
                  </div>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write your review here"
                    required
                    className={styles.textarea} // Added class for styling
                  />
                  <button type="submit" className={styles.submitButton}>Submit Review</button>
                </form>
          
                
              </div>

              </div>

              
            )}
    
            {activeTab === 'tags' && (
              <div className={styles.tagContainer}>
              <h1 className={styles.productheadingdetails}>Product Tags </h1>
                {product.tags && product.tags.length > 0 ? (
                  <div className={styles.tags}>
                    
                    <ul className={styles.optionsContainer}>
                      {product.tags.map((tag, index) => (
                        <li className={styles.optionButton} key={index}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No tags available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'Return' && (
              <div className={styles.tagContainer}>
              <h1 className={styles.productheadingdetails}>Product Shipping & Return </h1>
               <div>
               <ul className={styles.return_ul}>
               <li>We do not offer item exchanges for online orders at this time. To exchange an item for a new size or color you must return the unwanted item(s) and place a new web order for the desired item(s). Your returned item will be processed and a refund will be granted to the original form of payment as long as the item meets our return policy terms. Availability of replacement items is not guaranteed.
               </li>
               <li>Once a return is received, please allow 7-14 business days to process and 3-5 business days for the refund to be credited to the payment method used at the time of purchase.</li>
               <li>We do not offer item exchanges for online orders at this time. To exchange an item for a new size or color you must return the unwanted item(s) and place a new web order for the desired item(s). Your returned item will be processed and a refund will be granted to the original form of payment as long as the item meets our return policy terms. Availability of replacement items is not guaranteed.</li>
               
               </ul>

               </div>
              </div>
            )}

          </div>
        </div>


        <div className={styles.shareButtonContainer}>
        <div className={styles.sharebuttons}>
        <h1 className={styles.productheadingdetails}> Share </h1>
        <button onClick={() => handleShare('facebook')} className={styles.popupButtons}>
          <FaFacebookF /> 
        </button>
        <button onClick={() => handleShare('twitter')} className={styles.popupButtons}>
          <FaTwitter /> 
        </button>
        <button onClick={() => handleShare('whatsapp')} className={styles.popupButtons}>
          <FaWhatsapp /> 
        </button>
        <button onClick={handleCopyUrl} className={styles.popupButtons}>
          <FaCopy /> 
        </button>
      

        <button onClick={() => setSharePopupOpen(!sharePopupOpen)} className={styles.popupButtons}>
          <FaShareAlt /> 
        </button>
        </div>
        {sharePopupOpen && (
          <div className={styles.sharePopup}>
            <button onClick={() => handleShare('facebook')} className={styles.popupButton}>
              <FaFacebookF /> Facebook
            </button>
            <button onClick={() => handleShare('twitter')} className={styles.popupButton}>
              <FaTwitter /> Twitter
            </button>
            <button onClick={() => handleShare('whatsapp')} className={styles.popupButton}>
              <FaWhatsapp /> WhatsApp
            </button>
            <button onClick={handleCopyUrl} className={styles.popupButton}>
              <FaCopy /> Copy URL
            </button>
          </div>
        )}

       

      </div>
      


     
    


    
    <div className={styles.productList}>
    <h2 className={styles.producthad}>Related Products</h2>
    {recommendedProducts.length > 0 ? (
      <div className={styles.productGrid}>
        {recommendedProducts.map((recommendedProduct) => (
          <div key={recommendedProduct._id} className={styles.productItem}>
            <Link className={styles.link} href={`/product/details/${recommendedProduct._id}`}>


              <div className={styles.mainproduct_images}>
              <Image
                className={styles.product_list_images}
                src={recommendedProduct.media.length > 0 ? recommendedProduct.media[0] : '/default-image.jpg'}
                alt={recommendedProduct.name}
                width={900}
                height={900}
              />
            </div>

              <p className={styles.productName}>{trimText(recommendedProduct.name, 25)}</p>
            
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <p>No recommended products available.</p>
    )}
  </div>
  

        </>
      ) : (
        <p>Product not found</p>
      )}
    </div>
  );
}

export default ProductDetailsPage;

