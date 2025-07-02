


//

import { useState, useContext, useEffect } from 'react';
import 'animate.css';
import '../assets/Css/Appointment.css';
import { Context } from '../Context/CreateContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const timeSlots = [
    "8:00AM - 8:55AM", "9:00AM - 9:55AM",
    "11:00AM - 11:55AM", "12:00PM - 12:55PM", "1:00PM - 1:55PM",
    "2:00PM - 2:55PM", "3:00PM - 3:55PM", "4:00PM - 4:55PM",
    "6:00PM - 6:55PM", "7:00PM - 7:55PM", "8:00PM - 8:55PM", "9:00PM - 9:55PM",
];

const parseTimeTo24Hour = (timeStr) => {
    const [time, period] = timeStr.split(/(AM|PM)/i).filter(Boolean);
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
};

const BookAppointment = () => {
    const {
        setShowAppointmentForm, selectedDate, setSelectedDate,
        selectedSlot, setSelectedSlot, generateDates, userLoginData,
        formData, setFormData, userInfo, getBookedSlots,
        validCoupon, discount, setDiscount, getBookedSlotss,
        token, finalPrice, setFinalPrice, originalPrice, setOriginalPrice,
        setToken,getBookedSlotsss
    } = useContext(Context);

    const [bookedSlots, setBookedSlots] = useState([]);
    const now = new Date();

    const handleChange = async (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

        if (name === 'couponCode') {
            const code = value.trim().toUpperCase();
            setFormData(prev => ({ ...prev, couponCode: code }));

            if (code.length >= 3) {
                try {
                    const res = await fetch('https://myinnerside.com/api/coupons/apply', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            couponCode: code,
                            totalAmount: originalPrice // ✅ this is the fix!
                        }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                        const price = originalPrice;

                        let discountedPrice = price;
                        if (data.discounttype === 'percentage') {
                            discountedPrice = price - (price * data.discount / 100);
                        } else if (data.discounttype === 'flat') {
                            discountedPrice = price - data.discount;
                        }

                        // Apply max discount cap
                        if (
                            data.coupon.maxDiscountAmount &&
                            data.discounttype === 'percentage'
                        ) {
                            const maxDiscount = data.coupon.maxDiscountAmount;
                            const actualDiscount = price * data.discount / 100;
                            if (actualDiscount > maxDiscount) {
                                discountedPrice = price - maxDiscount;
                            }
                        }

                        setDiscount(data.discount);
                        setFinalPrice(Math.max(discountedPrice, 0));
                        toast.success(`Coupon applied! ₹${price - discountedPrice} off`);
                    } else {
                        setDiscount(0);
                        setFinalPrice(originalPrice);
                        toast.error(data.message);
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to validate coupon");
                }
            } else {
                setDiscount(0);
                setFinalPrice(originalPrice);
            }
        }


    };


    const discountPercentage = discount
        ? Math.round((discount / originalPrice) * 100)
        : 0;

    console.log("userLoginData:", userLoginData);





    const handleRazorpayPayment = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://myinnerside.com/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalPrice }),
            });
            const order = await res.json();

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Appointment Booking",
                description: "Payment for booking",
                order_id: order.id,
                handler: async function (response) {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                    const appointmentDetails = {
                        userId: userInfo._id,
                        name: userLoginData.name,
                        email: userLoginData.email,
                        gender: userLoginData.gender,
                        phone: formData.phone,
                        language: formData.language,
                        bookingReason: formData.bookingReason,
                        hideIdentity: formData.hideIdentity,
                        usePreviousDetails: formData.usePreviousDetails,
                        date: dayjs(selectedDate).format('YYYY-MM-DD'),
                        timeSlot: selectedSlot,
                        couponCode: formData.couponCode,
                        discount: discount,
                        price: finalPrice,
                    };

                    const verifyRes = await fetch('https://myinnerside.com/api/payment/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',Authorization: `${token}`, },
                        body: JSON.stringify({
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                            appointmentDetails // ✅ send the prepared object directly
                        })
                    });


                    const verifyData = await verifyRes.json();

                    if (verifyRes.ok) {
                        toast.success("Appointment booked successfully!");
                        setShowAppointmentForm(false);
                    } else {
                        toast.error(verifyData.message);
                    }
                },
                theme: { color: "#3399cc" }
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            toast.error("Payment failed.");
            console.error(err);
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!selectedDate || !selectedSlot || !formData.language || !formData.bookingReason) {
    //         toast.error("Please fill all fields before submitting.");
    //         return;
    //     }


    //     try {
    //         const dateOnly = dayjs(selectedDate).format('YYYY-MM-DD');

    //         const res = await fetch('https://myinnerside.com/api/appointments/book', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json', Authorization: `${token}`, },
    //             body: JSON.stringify({
    //                 userId: userInfo._id,
    //                 name: userLoginData.name,
    //                 email: userLoginData.email,
    //                 gender: userLoginData.gender,
    //                 phone: formData.phone,
    //                 language: formData.language,
    //                 bookingReason: formData.bookingReason,
    //                 hideIdentity: formData.hideIdentity,
    //                 usePreviousDetails: formData.usePreviousDetails,
    //                 date: dateOnly,
    //                 timeSlot: selectedSlot,
    //                 couponCode: formData.couponCode,

    //             })

    //         });



    //         const data = await res.json();
    //         if (res.ok) {
    //             toast.success(`Booking confirmed for ${selectedSlot}`);
    //             setShowAppointmentForm(false);
    //             setSelectedSlot(null);
    //             setFormData({ phone: '', language: '', bookingReason: '', couponCode: '' });

    //         } else {
    //             toast.error(data.message);
    //         }
    //     } catch (err) {
    //         toast.error("Booking failed.");
    //         console.error(err);
    //     }
    // };

  useEffect(() => {
    const fetchSlots = async () => {
        if (!selectedDate) return;
        const booked = await getBookedSlotss(selectedDate);
        const adminbooked = await getBookedSlotsss(selectedDate);
        console.log("Booked Slotssss:", booked, adminbooked);
        setBookedSlots([...booked, ...adminbooked]); 
    };

    fetchSlots();
}, [selectedDate]);




    // const bookedSlots = getBookedSlots(selectedDate);
    // console.log("Booked Slotsss:", bookedSlots);

    const isSlotOver = (slot) => {
        if (!dayjs(selectedDate).isSame(dayjs(), 'day')) return false;
        const slotTime = parseTimeTo24Hour(slot.split(' - ')[0]);
        const slotDate = new Date(selectedDate);
        slotDate.setHours(slotTime.hours, slotTime.minutes, 0, 0);
        return now > slotDate;
    };



    return (
        <div className="overlay">
            <div className="appointment_container animate__animated animate__fadeInRightBig">
                <div className="appointment_box">
                    <button className="close_btn" onClick={() => setShowAppointmentForm(false)}>✕</button>
                    <h2>Book an Appointment</h2>
                    <p>Select your preferred day and time</p>

                    <div className="booking_slot">
                        <h3>Select Date</h3>
                        <div className="date-grid">
                            {generateDates().map((date, index) => (
                                <div
                                    key={index}
                                    className={`date-box ${dayjs(date).isSame(selectedDate, 'day') ? 'active' : ''}`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <div className="weekday">{dayjs(date).format('ddd')}</div>
                                    <div className="day">{dayjs(date).format('D')}</div>
                                    <div className="month">{dayjs(date).format('MMM')}</div>
                                </div>
                            ))}
                        </div>

                        <h3>Select Time Slot</h3>
                        <div className="slot-grid">
                            {timeSlots.map((slot, index) => {
                                const isBooked = bookedSlots.includes(slot);
                                const isTimeOver = isSlotOver(slot);
                                const isDisabled = isBooked || isTimeOver;

                                return (
                                    <div
                                        key={index}
                                        className={`slot-box ${selectedSlot === slot ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onClick={() => !isDisabled && setSelectedSlot(slot)}
                                    >
                                        <div className='timing'>{slot}</div>
                                        <div className="status">
                                            {isBooked ? 'Booked' : isTimeOver ? 'Time Over' : 'Available'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedSlot && (
                        <div className="summary">
                            <h4>Booking Summary</h4>
                            <div className="summary_details">
                                <div className='col-half'>
                                    Selected Date : <p>{dayjs(selectedDate).format('ddd DD MMM YYYY')}</p>
                                </div>
                                <div className='col-half'>
                                    Selected Time: <p>{selectedSlot}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='hide_identity'>
                        <label>
                            <input type="checkbox" name="hideIdentity" checked={formData.hideIdentity} onChange={handleChange} />
                            Hide My Identity
                        </label>
                        <label>
                            <input type="checkbox" name="usePreviousDetails" checked={formData.usePreviousDetails} onChange={handleChange} />
                            Use Previous Card Details
                        </label>
                    </div>

                    <form className='appointment_form'>
                        <div className="form_group w-100">
                            <label>Number</label>
                            <input type="tel" name="phone" pattern="\d{10}" maxLength="10" autoComplete='off' className='form_control' placeholder='Contact Number*' value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form_group w-50">
                            <label>Language Preference</label>
                            <select name="language" className='form_control' required value={formData.language} onChange={handleChange}>
                                <option value="">Choose Language </option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                            </select>
                        </div>

                        <div className="form_group w-50">
                            <label>Select a reason to talk</label>
                            <select name="bookingReason" className='form_control' required value={formData.bookingReason} onChange={handleChange}>
                                <option value="">Choose a topic</option>
                                <option value="relationship">Relationship Issues</option>
                                <option value="stress">Mental Stress</option>
                                <option value="loneliness">Loneliness</option>
                                <option value="work_pressure">Work Pressure</option>
                                <option value="anxiety">Anxiety & Overthinking</option>
                                <option value="low_confidence">Low Confidence</option>
                                <option value="family_conflict">Family Conflict</option>
                                <option value="secret_sharing">Secret Sharing</option>
                                <option value="other">Others</option>
                            </select>
                        </div>

                        <div className="form_group apply_coupon w-100">
                            <label>Apply Coupon Code : </label>
                            <input className='form_control' name='couponCode' value={formData.couponCode} onChange={handleChange} type="text" placeholder='Enter Coupon Code' />
                        </div>

                        <div className='slot_price'>
                            <div className='discount_btn'>
                                <div className='ribbon'>
                                    ₹{finalPrice} Only {' '}
                                    {
                                        discount > 0 && (
                                            <span>
                                                ({discountPercentage}% off)
                                            </span>
                                        )
                                    }


                                </div>
                                <button className='form_btn' type="submit" onClick={handleRazorpayPayment}>Confirm Booking</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
