
import React from 'react'
import { Link } from 'react-router-dom'
import popUpImg from '../assets/mainbanner/popupImg.jpeg'
import '../assets/Css/Appointment.css'
import { useState,useEffect } from 'react'

const PopUp = () => {
      const [showPopup, setShowPopup] = useState(false);
    const [showCoupon, setShowCoupon] = useState(false);
    const [phone, setPhone] = useState('');

     useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(true);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone.trim() !== '') {
            setShowPopup(false);
            setShowCoupon(true);
            navigator.clipboard.writeText('Free@20');
        }
    };

    const handleClose = () => {
        setShowPopup(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <>
        
        {showPopup && (
                <div className="popup_overlay">
                    <div className='popup_container'>
                        <div className="popup_content">
                            <div className="popup_img">
                                <button className="close_btn" onClick={handleClose}>✕</button>
                                <img src={popUpImg} width="100%" alt="Promo" />
                            </div>

                            <div className="popup_contact_detail">
                                <div className="logo">
                                    <h2>UNLOCK FLAT 5% OFF</h2>
                                    <p>On Your Next Calling</p>
                                </div>

                                <form onSubmit={handleSubmit}> 
                                    <input
                                        type="tel"
                                        className='form_control'
                                        placeholder='Phone Number'
                                         pattern="\d{10}"
                                        maxLength="10"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <p>
                                        By submitting this form you accept our <Link to="/privacy-policy" onClick={handleClose}>Privacy Policy</Link>.
                                    </p>
                                    <button type='submit'>CLAIM DISCOUNT</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

         {showCoupon && (
                <div className="popup_overlay">
                    <div className='coupon_popup'>
                        <div className="coupon_code">
                            <h2> Congratulations!</h2>
                            <p>Your coupon code <strong>Free@20</strong> has been copied to your clipboard.</p>
                            <button onClick={() => setShowCoupon(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}    
 </>

    )
}

export default PopUp