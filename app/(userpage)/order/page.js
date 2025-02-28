
"use client"
// import { toast } from '../../../components/toastUtil';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext } from '../../../components/context/AuthContext';
// import styles from '../../../styles/home/Order.module.css';
import styles from '../../../styles/home/Orderto.module.css';
import { showToast } from '../../../components/toastUtil';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Image from 'next/image';
import axios from 'axios';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import Loader from "../../../components/Loader";
import { RiArrowGoBackLine } from "react-icons/ri";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    address2: '',
    phoneNo: '',
    city: '',
    state: '',
    landmark: '',
    country: '',
    pinCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [globalCoupon, setGlobalCoupon] = useState(null);
  const { user, setUser } = useContext(AuthContext);
  const [paymentSettings, setPaymentSettings] = useState({});
  const [inputerrors, setInputerrors] = useState({});
  const router = useRouter();
  
  const searchParams = useSearchParams();

  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  // const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    setCouponCode('');
    setCouponDiscount(0);
    setGlobalCoupon(null);

    const checkUserAuthentication = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/user/product/order', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);

        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
        const total = storedCart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
        setTotalAmount(total);

        const orderId = searchParams.get('orderId');
        if (orderId) {
          fetchOrderDetails(orderId);
        }

        fetchGlobalCoupon();
      } catch (error) {
        console.error('Error checking user authentication:', error);
        router.push('/login');
      }
      finally {
        setLoading(false);
      }
    };

    checkUserAuthentication();
  }, [router, searchParams, setUser]);
 


  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/setting');
        if (response.ok) {
          const data = await response.json();
          setPaymentSettings(data);
        } else {
          console.error('Failed to fetch settings');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error("User token is missing.");
        return;
      }
  
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/me/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (data) {
          const primaryAddress = data.savedShippingAddresses?.[0] || {}; // Get the first address or an empty object if none exists
  
          setShippingAddress({
            fullName: data.fullName || '',
            address: primaryAddress.address || '',
            address2: primaryAddress.address2 || '',
            phoneNo: primaryAddress.phoneNo || '',
            city: primaryAddress.city || '',
            state: primaryAddress.state || '',
            landmark: primaryAddress.landmark || '',
            country: primaryAddress.country || '',
            pinCode: primaryAddress.pinCode || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message || error.message);
      }
      finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  



  const fetchGlobalCoupon = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      const activeCoupon = data.find((coupon) => new Date(coupon.validUntil) > new Date());

      if (activeCoupon) {
        setGlobalCoupon(activeCoupon);
      } else {
        setGlobalCoupon(null);
      }
    } catch (error) {
      console.error('Error fetching global coupons:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      alert('Please enter a coupon code');
      return;
    }

    try {
      setLoading(true);
      let productCoupon = cartItems.find((item) =>
        item.coupons?.some((coupon) => coupon.code === couponCode)
      );

      if (productCoupon) {
        const appliedCoupon = productCoupon.coupons.find((coupon) => coupon.code === couponCode);
        setCouponDiscount(appliedCoupon.discount);
        toast(`Product coupon applied! ${appliedCoupon.discount}% discount`, 'success');
        return;
      }

      const response = await fetch(`/api/admin/coupons?code=${couponCode}`);
      const data = await response.json();

      if (!data || !data.code) {
        setCouponDiscount(0);
        alert('Invalid coupon code');
        return;
      }

      const isCouponValid = new Date(data.validUntil) > new Date();
      if (!isCouponValid) {
        alert('This coupon has expired');
        return;
      }

      setCouponDiscount(data.discount);
      toast(`Global coupon applied! ${data.discount}% discount`, 'success');
    } catch (error) {
      console.error('Error applying coupon:', error);
      alert('Failed to apply coupon');
    }
    finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setGlobalCoupon(null);
    toast('Coupon removed', 'info');
  };
  
  const handleOrderSubmit = async () => {


    if (!validateForm()) {
      return;  // Exit if the form is not valid
    }
    if (
      Object.values(shippingAddress).some((value) => !value) ||
      !paymentMethod ||
      !user ||
      !user._id
    ) {
      alert('Please fill in all fields and ensure you are logged in.');
      return;
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pinCode ||
      !shippingAddress.country
    ) {
      alert('Please fill in all the required address fields.');
      return;
    }
    setLoading(true);

    const discount = couponDiscount || (globalCoupon ? globalCoupon.discount : 0);
    const finalTotal = couponDiscount > 0 ? totalAmount - (totalAmount * couponDiscount) / 100 : totalAmount;
    const discountedTotal = discount === 0 ? totalAmount : finalTotal;

    console.log("Total Amount:", totalAmount);
    console.log("Discount:", discount);
    console.log("Discounted Total:", discountedTotal);


    const orderData = {
      user: user._id,
      orderItems: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        image: item.image,
        name: item.name,
        size: item.selectedSize,
        color: item.selectedColor,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice: discountedTotal,
      coupon: {
        //   code: couponCode,
        // discount: couponDiscount,
        code: couponDiscount ? couponCode : null,
        discount: couponDiscount || null,
      },
    };

    try {
      setLoading(true);
      let paymentSuccess = false;


      if (paymentMethod === 'RazorPay') {

        const response = await fetch('/api/payment/razorpay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: discountedTotal,
            currency: 'INR',
            // receipt: `order_rcptid_${order_id}`,
            receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
          }),
        });

        const { id: order_id } = await response.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: discountedTotal * 100,
          currency: 'INR',
          name: 'Your Company',
          description: 'Test Transaction',
          order_id,
          handler: async (response) => {
            try {
              const verifyResponse = await fetch('/api/payment/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (verifyResponse.ok) {
                paymentSuccess = true;

                // **Place the Order Now**
                const orderResponse = await fetch('/api/user/product/order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify(orderData),
                });

                if (orderResponse.ok) {
                  const data = await orderResponse.json();
                  toast('Order placed successfully!', 'success');
                  router.push(`/orderconfirm/${data.orderId}`);
                } else {
                  const errorData = await orderResponse.json();
                  alert(`Order placement failed: ${errorData.message}`);
                }
              } else {
                alert('Payment verification failed.');
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              alert('An error occurred while verifying the payment.');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: shippingAddress.phoneNo,
          },
          theme: {
            color: '#3399cc',
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      }
      else


        if (paymentMethod === 'Stripe') {
          if (!stripe || !elements) {
            alert("Stripe hasn't loaded yet. Please wait and try again.");
            return;
          }

          const cardElement = elements.getElement(CardElement);
          if (!cardElement || cardElement._empty) {
            alert('Please fill in your card details.');
            return;
          }

          try {
            // 1. Create Stripe payment intent first
            const paymentResponse = await fetch('/api/payment/stripe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                amount: discountedTotal, // Stripe requires amount in the smallest currency unit (e.g., cents for USD)
                description: `Purchase from Your Store`,
                customer: {
                  name: shippingAddress.fullName,
                  email: user.email,
                  address: {
                    line1: shippingAddress.address,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postal_code: shippingAddress.pinCode,
                    country: shippingAddress.country || 'IN',
                  },
                },
              }),
            });

            const { clientSecret, paymentIntentId } = await paymentResponse.json(); // Get clientSecret and paymentIntentId from backend

            // 2. Confirm the payment with Stripe
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: shippingAddress.fullName,
                  email: user.email,
                },
              },
            });

            if (error) {
              alert(`Payment failed: ${error.message}`);
              return;
            }

            if (paymentIntent.status === 'succeeded') {
              // 3. Payment succeeded, verify the payment
              const verifyResponse = await fetch('/api/payment/stripe/verfiy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  paymentIntentId: paymentIntent.id,
                  orderId: paymentIntentId, // Use the payment intent ID to track the order
                }),
              });

              if (verifyResponse.ok) {
                // 4. Payment verification succeeded, now create the order including `payment_order_id`
                const orderResponse = await fetch('/api/user/product/order', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({
                    ...orderData, // All order-related details
                    payment_order_id: paymentIntentId, // Add Stripe paymentIntent ID to the order
                  }),
                });

                if (orderResponse.ok) {
                  const data = await orderResponse.json();
                  toast('Order placed successfully!', 'success');
                  router.push(`/orderconfirm/${data.orderId}`);
                } else {
                  const errorData = await orderResponse.json();
                  alert(`Order placement failed: ${errorData.message}`);
                }
              } else {
                alert('Payment verification failed.');
              }
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred during payment processing.');
          }
        }







        else if (paymentMethod === 'PayPal') {
          const response = await fetch('/api/payment/paypal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: discountedTotal }),
          });

          const { approvalUrl } = await response.json();
          window.location.href = approvalUrl;
          paymentSuccess = true; // Assume success if redirected to PayPal
        } else {
          // Cash on Delivery or Other Payment Method
          paymentSuccess = true;
        }

      // If payment is successful, place the order
      if (paymentSuccess) {
        const orderResponse = await fetch('/api/user/product/order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(orderData),
        });

        if (orderResponse.ok) {
          const data = await orderResponse.json();
          toast.success('Order placed successfully!', 'success');
          router.push(`/orderconfirm/${data.orderId}`);
        } else {
          const errorData = await orderResponse.json();
          alert(`Order placement failed: ${errorData.message}`);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }

    finally {
      setLoading(false);
    }
  };





  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingAddress((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    console.log(`${method} selected as the payment method`);
  };

  const getPlaceholder = (field) => {
    switch (field) {
      case 'fullName':
        return 'Full Name ';
      case 'address':
        return 'Address 1';
      case 'address2':
        return 'Address 2';
      case 'phoneNo':
        return 'Phone Number';
      case 'city':
        return 'City ';
      case 'state':
        return 'State';
      case 'landmark':
        return 'Landmark';
      case 'country':
        return 'Country';
      case 'pinCode':
        return 'PIN Code';
      default:
        return '';
    }
  };

  const getErrorMessage = (field) => {
    switch (field) {
      case 'fullName':
        return 'Full name is required';
      case 'address':
        return 'Address is required';
      case 'address2':
        return 'Address2 is required';
      case 'phoneNo':
        return 'Phone number is required';
      case 'city':
        return 'City is required';
      case 'state':
        return 'State is required';
      case 'country':
        return 'Country is required';
      case 'pinCode':
        return 'PIN code is required';
      case 'pinCode':
        return 'PIN code is required';
      case 'landmark':
        return 'landmark code is required';
      default:
        return 'This field is required';
    }

  };




  
  const validateForm = () => {
    const newErrors = {};

    if (!shippingAddress.fullName) {
      newErrors.fullName = true;
    }
    if (!shippingAddress.address) {
      newErrors.address = true;
    }
    if (!shippingAddress.address2) {
      newErrors.address2 = true;
    }

    if (!shippingAddress.phoneNo) {
      newErrors.phoneNo = true;
    }
    if (!shippingAddress.city) {
      newErrors.city = true;
    }
    if (!shippingAddress.state) {
      newErrors.state = true;
    }
    if (!shippingAddress.country) {
      newErrors.country = true;
    }
    if (!shippingAddress.pinCode) {
      newErrors.pinCode = true;
    }

    if (!shippingAddress.landmark) {
      newErrors.landmark = true;
    }

    setInputerrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };


  if (loading) {
    return <Loader />; 
  }

  return (
    <div className={styles.checkoutPag}>
      {loading && <Loader />}
    <div className={styles.ShippingInformation}> 
    <button className={styles.arrowButton} >  <RiArrowGoBackLine /></button>
    <div className={styles.ShippingInformationh1}>
    <h1>Provide Your Shipping Information</h1>
    <p>Check your information before you continue</p>
    </div>
    </div>



    <div className={styles.checkoutPage}>
     
<div className={styles.checkoutForm} >
      <div className={styles.orderSummary}>

      
      <h2>Order Summary</h2>

      {/* Product Image */}
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            {/* Product Image */}
            {item.media && item.media.length > 0 && (

              <Image
                src={item.media[0] || '/default-image.png'}
                alt={item.name}
                width={900}
                height={900}
                className={styles.orderImage}
                priority
              />

            )}

            {/* Product Details */}
            <div className={styles.nameprice}>  
            <span className={styles.orderproductname}>{item.name.length > 30 ? item.name.slice(0, 30) + "..." : item.name}</span>
            
            <div className={styles.sizecolor}>
            <p>₹{item.price} x {item.quantity}</p> 
            </div>

              <div className={styles.sizecolor}>
                {item?.selectedSize && <p>{item.selectedSize}</p>}
                {item?.selectedColor && <p>{item.selectedColor}</p>}

                {/*{item?.selectedSize && <p>Size: {item.selectedSize}</p>}
                {item?.selectedColor && <p>Color: {item.selectedColor}</p>}*/}
              </div>
            </div>



          </li>
        ))}
      </ul>

     

      <h3>Total: ${totalAmount}</h3>
      {couponDiscount > 0 && (
        <h3>Discount: {couponDiscount}%</h3>
      )}
      <h3>Subtotal: ${totalAmount - (totalAmount * couponDiscount) / 100}</h3>
    
    
    </div>
 
      <div className={styles.couponSection}>
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={applyCoupon}>Apply Coupon Code</button>
          {couponDiscount > 0 && (
            <button className={styles.btncouponSection} onClick={removeCoupon}>Remove Coupon</button>
          )}
          {couponDiscount > 0 && (
            <div>
              <h3>Applied Coupon: {couponCode}</h3>
              <h3>Discount: {couponDiscount}%</h3>
            </div>
          )}
        </div>
 </div>

      <div className={styles.checkoutForm}>
        <h2>Shipping Address</h2>
        <div className={styles.shippingForm}>

          {Object.keys(shippingAddress).map((field) => (
            <div key={field} className={styles.formGroup}>
              <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
              <input
                type="text"
                id={field}
                value={shippingAddress[field] || ""}
                onChange={handleInputChange}
                placeholder={getPlaceholder(field)}
                className={inputerrors[field] ? styles.errorInput : ''}
              />
              {inputerrors[field] && <p className={styles.errorMessage}>{getErrorMessage(field)}</p>} {/* Display error */}
            </div>
          ))}
        </div>
        <div className={styles.paymentMethod}>
          <h2>Payment Method</h2>
          <div className={styles.paymentButtons}>
            {paymentSettings.enableCOD && (
              <button
                className={`${styles.paymentButton} ${paymentMethod === 'cashOnDelivery' ? styles.selected : ''}`}
                onClick={() => handlePaymentMethodChange('cashOnDelivery')}
              >
                Cash on Delivery
              </button>
            )}
            {paymentSettings.enableStripe && (
              <button
                className={`${styles.paymentButton} ${paymentMethod === 'Stripe' ? styles.selected : ''}`}
                onClick={() => handlePaymentMethodChange('Stripe')}
              >
                Pay with Stripe
              </button>
            )}
            {paymentSettings.enableRazorPay && (
              <button
                className={`${styles.paymentButton} ${paymentMethod === 'RazorPay' ? styles.selected : ''}`}
                onClick={() => handlePaymentMethodChange('RazorPay')}
              >
                Pay with RazorPay
              </button>
            )}
          </div>
        </div>
        {paymentMethod === 'Stripe' && (
          <div className={styles.cardContainer}>
            <h2 className={styles.cardTitle}>Card Details</h2>
            <CardElement
              className={styles.cardElement}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        )}




      
        <button className={styles.orderButton} onClick={handleOrderSubmit}>
          Place Order
        </button>
      </div>

    </div>

    </div>
  );
};

const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <OrderPage />
  </Elements>
);

export default StripeWrapper;
