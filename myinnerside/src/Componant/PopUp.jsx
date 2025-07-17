
// import React from 'react'
// import { Link } from 'react-router-dom'
// import popUpImg from '../assets/mainbanner/popupImg.jpeg'
// import '../assets/Css/Appointment.css'
// import { useState,useEffect } from 'react'

// const PopUp = () => {
//       const [showPopup, setShowPopup] = useState(false);
//     const [showCoupon, setShowCoupon] = useState(false);
//     const [phone, setPhone] = useState('');

//      useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowPopup(true);
//             document.body.style.overflow = 'hidden'; // Prevent scrolling
//         }, 5000);
//         return () => clearTimeout(timer);
//     }, []);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (phone.trim() !== '') {
//             setShowPopup(false);
//             setShowCoupon(true);
//             navigator.clipboard.writeText('Free@20');
//         }
//     };

//     const handleClose = () => {
//         setShowPopup(false);
//         document.body.style.overflow = 'auto';
//     };

//     return (
//         <>
        
//         {showPopup && (
//                 <div className="popup_overlay">
//                     <div className='popup_container'>
//                         <div className="popup_content">
//                             <div className="popup_img">
//                                 <button className="close_btn" onClick={handleClose}>✕</button>
//                                 <img src={popUpImg} width="100%" alt="Promo" />
//                             </div>

//                             <div className="popup_contact_detail">
//                                 <div className="logo">
//                                     <h2>UNLOCK FLAT 5% OFF</h2>
//                                     <p>On Your Next Calling</p>
//                                 </div>

//                                 <form onSubmit={handleSubmit}> 
//                                     <input
//                                         type="tel"
//                                         className='form_control'
//                                         placeholder='Phone Number'
//                                          pattern="\d{10}"
//                                         maxLength="10"
//                                         required
//                                         value={phone}
//                                         onChange={(e) => setPhone(e.target.value)}
//                                     />
//                                     <p>
//                                         By submitting this form you accept our <Link to="/privacy-policy" onClick={handleClose}>Privacy Policy</Link>.
//                                     </p>
//                                     <button type='submit'>CLAIM DISCOUNT</button>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//          {showCoupon && (
//                 <div className="popup_overlay">
//                     <div className='coupon_popup'>
//                         <div className="coupon_code">
//                             <h2> Congratulations!</h2>
//                             <p>Your coupon code <strong>Free@20</strong> has been copied to your clipboard.</p>
//                             <button onClick={() => setShowCoupon(false)}>Close</button>
//                         </div>
//                     </div>
//                 </div>
//             )}    
//  </>

//     )
// }

// export default PopUp







import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import popUpImg from '../assets/mainbanner/myinnersidepopup.jpg';
import '../assets/Css/Appointment.css';
import { IoGiftSharp } from "react-icons/io5";

const PopUp = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [phone, setPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Show popup after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      document.body.style.overflow = 'hidden';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await fetch('https://myinnerside.com/api/coupons/active');
        const data = await res.json();
        if (res.ok) {
          setCouponCode(data.coupon.couponCode);
        } else {
          console.warn('No active coupon available');
        }
      } catch (err) {
        console.error('Error fetching coupon:', err);
      }
    };
    fetchCoupon();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!phone.trim()) return;

  //   try {
  //     await fetch('https://myinnerside.com/api/coupons/claim', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ phone }),
  //     });

      
  //     setShowPopup(false);
  //     setShowCoupon(true);
  //     document.body.style.overflow = 'auto';

      
  //     if (couponCode) {
  //       navigator.clipboard.writeText(couponCode);
  //     }
  //   } catch (error) {
  //     console.error('Error saving phone:', error);
  //     alert('Something went wrong.');
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!phone.trim()) return;

  try {
    const res = await fetch('https://myinnerside.com/api/coupons/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 409 || result.status === 'already_claimed') {
        setErrorMessage('This number has already claimed the coupon.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
      return;
    }

    setShowPopup(false);
    setShowCoupon(true);
    document.body.style.overflow = 'auto';

    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
    }
  } catch (error) {
    console.error('Error saving phone:', error);
    setErrorMessage('Something went wrong. Please try again.');
  }
};

  const handleClose = () => {
    setShowPopup(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      {showPopup && couponCode && (
        <div className="popup_overlay">
          <div className="popup_container">
            <div className="popup_content">
              <div className="popup_img">
                <button className="close_btn" onClick={handleClose}>✕</button>
                <img src={popUpImg} width="100%" alt="Promo" />
              </div>

              <div className="popup_contact_detail">
                <div className="logo">
                  <h2>UNLOCK YOUR OFFER</h2>
                  {/* <p>Use Coupon: <strong>{couponCode}</strong></p> */}
                </div>

                <form onSubmit={handleSubmit}>
                  <input
                    type="tel"
                    className="form_control"
                    placeholder="Phone Number"
                    pattern="\d{10}"
                    maxLength="10"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p>
                    By submitting this form you accept our{' '}
                    <Link to="/privacy-policy" onClick={handleClose}>Privacy Policy</Link>.
                  </p>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}

                  <button type="submit">CLAIM DISCOUNT</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCoupon && (
        <div className="popup_overlay">
          <div className="coupon_popup">
            <div className="coupon_code">
              <h2> <IoGiftSharp className='icon' /> Congratulations!</h2>
              <p>Your coupon <strong>{couponCode}</strong> has been copied to clipboard.</p>
              <button onClick={() => setShowCoupon(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
