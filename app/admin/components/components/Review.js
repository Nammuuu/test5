

"use client";

import { useState, useEffect } from 'react';
import styles from './review.module.css';
import { FaStar,  } from 'react-icons/fa';
import Link from 'next/link'
import axios from "axios";
import Image from "next/image";

const AdminReviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    // Fetch all products and their reviews
    const fetchProductsAndReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
    
        const response = await axios.get('/api/admin/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
    
    
        if (response.status === 200) {
          setProducts(response.data.products); // Assuming 'products' is inside response.data
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        setError('Error fetching products and reviews');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndReviews();
  }, []);

  



  const deleteReview = async (productId, reviewId) => {
    try {

        

          
      const response = await fetch(`/api/admin/reviews/${productId}/review/${reviewId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Review deleted successfully:', data);
        // Update the product state to remove the deleted review
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product._id === productId) {
              return { ...product, reviews: product.reviews.filter((review) => review._id !== reviewId) };
            }
            return product;
          })
        );
      } else {
        console.error('Error deleting review:', data.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  

  const [expandedProduct, setExpandedProduct] = useState({});
  const [expandedComment, setExpandedComment] = useState({});

  const toggleMoreLess = (id, type) => {
    if (type === 'product') {
      setExpandedProduct(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else {
      setExpandedComment(prev => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Reviews</h1>
      <div className={styles.productCardContainer}>
      {products.length > 0 ? (
        products
          .filter(product => product.reviews.length > 0)
          .map(product => (
           
            <div key={product._id} className={styles.productCard}>
           
            <div className={styles.productContainer}> 

              <h2 className={styles.productName}>
                {expandedProduct[product._id]
                  ? product.name
                  : truncateText(product.name, 20)}
                {product.name.length > 20 && (
                  <button
                    className={styles.moreButton}
                    onClick={() => toggleMoreLess(product._id, 'product')}
                  >
                    {expandedProduct[product._id] ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </h2>

              <Link className={styles.productLink}  href={`/product/details/${product._id}`}> View product</Link>
             
</div>
              

              <ul className={styles.reviewList}>

            
              <h3 className={styles.reviewsHeading}>
  Reviews ({product.reviews.length})
</h3>

          

                {product.reviews.map(review => (
                  <li key={review._id} className={styles.reviewItem}>
                    <div className={styles.review}>

                    <div  className={styles.displayflex_flex_cul}>
                     <p className={styles.action}>User</p>

                     <Image
               src={review?.profilePictureImagePreview || '/defaultProfilePic.jpg'}
               alt="User profile"
               className={styles.profilePicture} 
        width={500}
        height={500}
      />

                   

                   <span>{review.user?.username || 'Unknown'}</span>

                   </div>



                      <div className={styles.stars}>
                       <p className={styles.action}>Rating</p>
                       <div>
                        {[...Array(5)].map((_, starIndex) => (
                          <FaStar
                            key={starIndex}
                            size={20}
                            color={starIndex + 1 <= review.rating ? '#ffc107' : '#e4e5e9'}
                          />
                        ))}
                        </div>
                      </div>

                   

                      <div className={styles.displayflex_flex_cul}>
                    <p className={styles.action}>Comment:</p>{' '}
                      <h3 className={styles.comment}>
                        {expandedComment[review._id]
                          ? review.comment
                          : truncateText(review.comment, 20)}
                        {review.comment.length > 20 && (
                          <button
                            className={styles.moreButton}
                            onClick={() => toggleMoreLess(review._id, 'comment')}
                          >
                            {expandedComment[review._id] ? 'Show Less' : 'Show More'}
                          </button>
                        )}
                      </h3>
                      </div>

                      <div className={styles.reviewHeader}>    
                          <p className={styles.action}>Action</p>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteReview(product._id, review._id)}
                      >
                        Delete Review
                      </button>

                      <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    </div>
                 

                    </div>

                  </li>
                ))}
              </ul>
            </div>
           

          ))
      ) : (
        <p className={styles.noProducts}>No products found.</p>
      )}
    </div>
     </div>
  );
};

export default AdminReviews;

