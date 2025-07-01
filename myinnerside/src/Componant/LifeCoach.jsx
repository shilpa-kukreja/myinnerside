
// import React, { useEffect, useState } from 'react'
// import banner from '../assets/mainbanner/banner.jpeg'

// import CommonHeading from './CommonHeading'
// import coreValue from '../assets/mainbanner/core-value.jpeg'
// import dayjs from 'dayjs';

// import { useContext } from 'react';

// import { Context } from '../Context/CreateContext';

// import '../assets/Css/Service.css'
// import { toast } from 'react-toastify';





// const timeSlots = [
//     "8:00AM - 12:00PM",
//     "12:00PM - 4:00PM",
//     "4:00PM - 8:00PM",
// ];
// const parseTimeTo24Hour = (timeStr) => {
//     const [time, period] = timeStr.split(/(AM|PM)/i).filter(Boolean);
//     let [hours, minutes] = time.split(':').map(Number);
//     if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
//     if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
//     return { hours, minutes };
// };


// const LifeCoach = () => {

//     const { lifeCoachBooking, setLifeCoachBooking, generateDates,getBookedlifecoachSlotss, getBookedSlots,lifeCoachBookingList,setLifeCoachBookingList,
//     addLifeCoachBooking,userLoginData, } = useContext(Context);
  
//   const [bookedSlots, setBookedSlots] = useState([]);

//     const now = new Date();

//     const handleChange = (e) => {

//         const { name, value } = e.target;
        
//         setLifeCoachBooking(prev => ({ ...prev, [name]: value }))
//     }

   


//     const handleSubmit = (e) => {
//   e.preventDefault();

//   if (!lifeCoachBooking.slot || !lifeCoachBooking.language || !lifeCoachBooking.bookingReason) {
//     toast.error("Please fill all fields before submitting.");
//     return;
//   }

//   toast.success(`Booking confirmed on ${dayjs(lifeCoachBooking.date).format("DD MMM YYYY")} at ${lifeCoachBooking.slot}`);

//   const fullBooking = {
//     ...lifeCoachBooking,
//     name: userLoginData?.name || '',
//     email: userLoginData?.email || '',
//     gender: userLoginData?.gender || '',
//   };

//   addLifeCoachBooking(fullBooking);

//   setLifeCoachBooking(() => ({
//     date: generateDates()[0],
//     slot: null,
//     number: '',
//     language: '',
//     bookingReason: ''
//   }));
// };


//    useEffect(() => {
//   const fetchBookedSlots = async () => {
//     const all = await getBookedlifecoachSlotss();
//     const selectedDay = dayjs(lifeCoachBooking.date).format("YYYY-MM-DD");

//     const filtered = all
//       .filter(slot => slot.date === selectedDay)
//       .map(slot => slot.slot);

//     setBookedSlots(filtered); // assumes you have useState for this
//   };

//   if (lifeCoachBooking.date) {
//     fetchBookedSlots();
//   }
// }, [lifeCoachBooking.date]);


//     const isSlotOver = (slot) => {
//         if (!dayjs(lifeCoachBooking.date).isSame(dayjs(), 'day')) return false;
//         const slotTime = parseTimeTo24Hour(slot.split(' - ')[0]);
//         const slotDate = new Date(lifeCoachBooking.date);
//         slotDate.setHours(slotTime.hours, slotTime.minutes, 0, 0);
//         return now > slotDate;
//     };

//     return (
//         <>
//             <img src={banner} alt="lifeCoach-img" />
//             <div className='lifeCoach_section'>
//                 <div className="container">

//                     <CommonHeading title="Life Coach Session" />

//                     <div className="about_lifeCoach_cont">
//                         <h4>
//                             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Blanditiis dolores expedita reiciendis vero sit nulla quod, iste explicabo eius repudiandae, et doloremque ab excepturi earum obcaecati! Placeat, inventore quam. A! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quo nobis pariatur dolorum recusandae veritatis animi architecto fuga similique optio. Beatae fugit sed consequatur velit quisquam commodi animi error. Facilis.
//                         </h4>
//                     </div>


//                     <div className="lifeCoach_slide_section">

//                         <div className="col-half">

//                             {/* <img src={coreValue} alt="img-of-lifecoach" /> */}

//                             <div className="bokking_session_slot">

//                                 <h3>Book Life Coach Session</h3>
//                                 <div className="booking_session">
//                                     <div className="date-grid">
//                                         {
//                                             generateDates().map((date, index) => {
//                                                 const isSelected = dayjs(date).isSame(lifeCoachBooking.date, 'day')
//                                                 return (
//                                                     <div
//                                                         key={index}
//                                                         className={`date-box ${isSelected ? 'active' : ''}`}
//                                                         onClick={() => setLifeCoachBooking(prev => ({ ...prev, date }))}
//                                                     >
//                                                         <div className="weekday">{dayjs(date).format('ddd')}</div>
//                                                         <div className="day">{dayjs(date).format('D')}</div>
//                                                         <div className="month">{dayjs(date).format('MMM')}</div>
//                                                     </div>
//                                                 )
//                                             })
//                                         }

//                                     </div>
//                                 </div>
//                             </div>


//                         </div>
//                         <div className="col-half">
//                             <div className="bokking_session_slot">


//                                 <h3>Select Time Slot</h3>
//                                 <div className='booking_session_slot'>


//                                     {timeSlots.map((slot, index) => {
//                                         const isSelected = lifeCoachBooking.slot === slot;
//                                         const isBooked = bookedSlots.includes(slot);
//                                         const isTimeOver = isSlotOver(slot);
//                                         const isDisabled = isBooked || isTimeOver;
//                                         return (
//                                             <div
//                                                 key={index}
//                                                 className={`slot-box ${isSelected ? 'active' : ''}  ${isDisabled ? 'disabled' : ''} `}
//                                                 onClick={() =>
//                                                    !isDisabled && setLifeCoachBooking(prev => ({ ...prev, slot }))
//                                                 }
//                                             >
//                                                 <div className='timing'>{slot}</div>
//                                                  <div className="status">
//                                             {isBooked ? 'Booked' : isTimeOver ? 'Time Over' : 'Available'}
//                                         </div>
//                                             </div>
//                                         );
//                                     })}

//                                 </div>
//                                 {
//                                     lifeCoachBooking.slot && (
//                                         <div className="booking_session_summary">
//                                             <h4>Booking Summary</h4>
//                                             <div className="summary_details">

//                                                 <div className='col-half'>
//                                                     Selected Date :- <p> {dayjs(lifeCoachBooking.date).format('ddd')} {dayjs(lifeCoachBooking.date).format('DD MMM YYYY')}</p>
//                                                 </div>
//                                                 <div className='col-half'>
//                                                     Selected Time  :-  <p> {lifeCoachBooking.slot}</p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )
//                                 }


//                                 <form action="" className='session_form' onSubmit={handleSubmit}>

//                                     <div className='form_group w-100'>
//                                         <label htmlFor="">Number</label>
//                                         <input type="tel" pattern="\d{10}" maxLength={10} value={lifeCoachBooking.number} autoFocus="off" onChange={handleChange} className='form_control' placeholder='Contact Number*' name='number' />
//                                     </div>

//                                     <div className="form_group w-50">
//                                         <label>Language Preference</label>
//                                         <select name="language" className='form_control' value={lifeCoachBooking.language} required onChange={handleChange}>
//                                             <option value="">Choose Language </option>
//                                             <option value="english">English</option>
//                                             <option value="hindi">Hindi</option>

//                                         </select>
//                                     </div>

//                                     <div className="form_group w-50">
//                                         <label>Select a reason to talk  </label>
//                                         <select name="bookingReason" className='form_control' value={lifeCoachBooking.bookingReason} required onChange={handleChange} >
//                                             <option value="">Choose a topic </option>
//                                             <option value="relationship ">Relationship Issues</option>
//                                             <option value="stress"> Mental Stress</option>
//                                             <option value="loneliness">Loneliness</option>
//                                             <option value="work_pressure">Work Pressure</option>
//                                             <option value="anxiety"> Anxiety & Overthinking</option>
//                                             <option value="low_confidence"> Low Confidence</option>
//                                             <option value="family_conflict"> Family Conflict</option>
//                                             <option value="secret_sharing"> Secret Sharing</option>
//                                             <option value="other">Others</option>
//                                         </select>
//                                     </div>

//                                     <button className='form_btn' type="submit">  Confirm Booking </button>


//                                 </form>




//                             </div>




//                         </div>

//                     </div>






//                 </div>




//             </div>
//         </>
//     )
// }

// export default LifeCoach











import React, { useEffect, useState, useContext } from 'react';
import banner from '../assets/mainbanner/banner.jpeg';
import CommonHeading from './CommonHeading';
import dayjs from 'dayjs';
import { Context } from '../Context/CreateContext';
import '../assets/Css/Service.css';
import { toast } from 'react-toastify';

const timeSlots = [
  "8:00AM - 12:00PM",
  "12:00PM - 4:00PM",
  "4:00PM - 8:00PM",
];

// Convert time to 24-hour format to compare with current time
const parseTimeTo24Hour = (timeStr) => {
  const [time, period] = timeStr.split(/(AM|PM)/i).filter(Boolean);
  let [hours, minutes] = time.split(':').map(Number);
  if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

const LifeCoach = () => {
  const {
    lifeCoachBooking,
    setLifeCoachBooking,
    generateDates,
    getBookedlifecoachSlotss,
    lifeCoachBookingList,
    setLifeCoachBookingList,
    addLifeCoachBooking,
    userLoginData,
  } = useContext(Context);

  const [bookedSlots, setBookedSlots] = useState([]);
  const now = new Date();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLifeCoachBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!lifeCoachBooking.slot || !lifeCoachBooking.language || !lifeCoachBooking.bookingReason || !lifeCoachBooking.number) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    toast.success(`Booking confirmed on ${dayjs(lifeCoachBooking.date).format("DD MMM YYYY")} at ${lifeCoachBooking.slot}`);

    const fullBooking = {
      ...lifeCoachBooking,
      name: userLoginData?.name || '',
      email: userLoginData?.email || '',
      gender: userLoginData?.gender || '',
    };

    addLifeCoachBooking(fullBooking);

    setLifeCoachBooking(() => ({
      date: generateDates()[0],
      slot: null,
      number: '',
      language: '',
      bookingReason: ''
    }));
  };

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      const all = await getBookedlifecoachSlotss();
      const selectedDay = dayjs(lifeCoachBooking.date).format("YYYY-MM-DD");

      const filtered = all
        .filter(slot => slot.date === selectedDay)
        .map(slot => slot.slot);

      setBookedSlots(filtered);
    };

    if (lifeCoachBooking.date) {
      fetchBookedSlots();
    }

    // Clear selected slot when changing date
    setLifeCoachBooking(prev => ({ ...prev, slot: null }));
  }, [lifeCoachBooking.date]);

  const isSlotOver = (slot) => {
    if (!dayjs(lifeCoachBooking.date).isSame(dayjs(), 'day')) return false;
    const slotTime = parseTimeTo24Hour(slot.split(' - ')[0]);
    const slotDate = new Date(lifeCoachBooking.date);
    slotDate.setHours(slotTime.hours, slotTime.minutes, 0, 0);
    return now > slotDate;
  };

  const allSlotsDisabled = timeSlots.every(slot => bookedSlots.includes(slot) || isSlotOver(slot));

  return (
    <>
      <img src={banner} alt="lifeCoach-img" />
      <div className='lifeCoach_section'>
        <div className="container">
          <CommonHeading title="Life Coach Session" />

          <div className="about_lifeCoach_cont">
            <h4>
              Get personalized one-on-one guidance from certified life coaches to manage stress, relationships, self-confidence, and more. Select your preferred date and time below to begin.
            </h4>
          </div>

          <div className="lifeCoach_slide_section">
            <div className="col-half">
              <div className="bokking_session_slot">
                <h3>Book Life Coach Session</h3>
                <div className="booking_session">
                  <div className="date-grid">
                    {generateDates().map((date, index) => {
                      const isSelected = dayjs(date).isSame(lifeCoachBooking.date, 'day');
                      return (
                        <div
                          key={index}
                          className={`date-box ${isSelected ? 'active' : ''}`}
                          onClick={() => setLifeCoachBooking(prev => ({ ...prev, date }))}
                        >
                          <div className="weekday">{dayjs(date).format('ddd')}</div>
                          <div className="day">{dayjs(date).format('D')}</div>
                          <div className="month">{dayjs(date).format('MMM')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-half">
              <div className="bokking_session_slot">
                <h3>Select Time Slot</h3>
                <div className='booking_session_slot'>
                  {timeSlots.map((slot, index) => {
                    const isSelected = lifeCoachBooking.slot === slot;
                    const isBooked = bookedSlots.includes(slot);
                    const isTimeOver = isSlotOver(slot);
                    const isDisabled = isBooked || isTimeOver;

                    return (
                      <div
                        key={index}
                        className={`slot-box ${isSelected ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => !isDisabled && setLifeCoachBooking(prev => ({ ...prev, slot }))}
                      >
                        <div className='timing'>{slot}</div>
                        <div className="status">
                          {isBooked ? 'Booked' : isTimeOver ? 'Time Over' : 'Available'}
                        </div>
                      </div>
                    );
                  })}
                  {/* {allSlotsDisabled && (
                    <p className="no-slots-message">All slots for this date are booked or over. Please choose another day.</p>
                  )} */}
                </div>

                {lifeCoachBooking.slot && (
                  <div className="booking_session_summary">
                    <h4>Booking Summary</h4>
                    <div className="summary_details">
                      <div className='col-half'>
                        Selected Date :- <p>{dayjs(lifeCoachBooking.date).format('ddd DD MMM YYYY')}</p>
                      </div>
                      <div className='col-half'>
                        Selected Time :- <p>{lifeCoachBooking.slot}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form className='session_form' onSubmit={handleSubmit}>
                  <div className='form_group w-100'>
                    <label htmlFor="">Number</label>
                    <input
                      type="tel"
                      pattern="\d{10}"
                      maxLength={10}
                      name='number'
                      value={lifeCoachBooking.number}
                      onChange={handleChange}
                      className='form_control'
                      placeholder='Contact Number*'
                    />
                  </div>

                  <div className="form_group w-50">
                    <label>Language Preference</label>
                    <select
                      name="language"
                      className='form_control'
                      value={lifeCoachBooking.language}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Choose Language</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                    </select>
                  </div>

                  <div className="form_group w-50">
                    <label>Select a reason to talk</label>
                    <select
                      name="bookingReason"
                      className='form_control'
                      value={lifeCoachBooking.bookingReason}
                      onChange={handleChange}
                      required
                    >
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

                  <button className='form_btn' type="submit">Confirm Booking</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LifeCoach;
