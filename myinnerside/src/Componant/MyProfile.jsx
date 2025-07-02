import '../assets/Css/AuthForm.css';
import { HiUsers } from "react-icons/hi2";
import { LuNotebookPen } from "react-icons/lu";
import { MdAddPhotoAlternate } from "react-icons/md";
import { FaCcMastercard } from "react-icons/fa";
import userProfile from '../assets/mainbanner/user2.png';
import { useState, useEffect, useContext } from 'react';
import { CgLogOut } from "react-icons/cg";
import { MdDateRange } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { Context } from '../Context/CreateContext';
import dayjs from 'dayjs';
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { FaHome } from "react-icons/fa";
import { FcVideoCall } from "react-icons/fc";
import { FaVideo } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';






const MyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('userInfo');
    const [imageFile, setImageFile] = useState(null);
    const [showPassword, setShowPassword] = useState({});
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
    const [rescheduleIndex, setRescheduleIndex] = useState(null);
 
    const [rescheduleData, setRescheduleData] = useState({
        date: new Date(),
        slot: ''
    });



    const timeSlots = [
        "8:00AM - 8:55AM", "9:00AM - 9:55AM", "10:00AM - 10:55AM",
        "11:00AM - 11:55AM", "12:00PM - 12:55PM", "1:00PM - 1:55PM",
        "2:00PM - 2:55PM", "3:00PM - 3:55PM", "4:00PM - 4:55PM",
        "5:00PM - 5:55PM"
    ];

    // Improved isSlotOver function
    const isSlotOver = (slot, selectedDate) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const selectedDay = new Date(selectedDate);
        selectedDay.setHours(0, 0, 0, 0);

        // Only check time for today's date
        if (selectedDay.getTime() === today.getTime()) {
            const [startTimeStr] = slot.split(' - ');
            const [time, period] = startTimeStr.match(/(\d+:\d+)(AM|PM)/i).slice(1);

            let [hours, minutes] = time.split(':').map(Number);
            if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

            const slotTime = new Date();
            slotTime.setHours(hours, minutes, 0, 0);

            return now > slotTime;
        }
        return false;
    };
    const parseTimeTo24Hour = (timeStr) => {
        const [time, period] = timeStr.split(/(AM|PM)/i).filter(Boolean);
        let [hours, minutes] = time.split(':').map(Number);
        if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
        if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
        return { hours, minutes };
    };

    const {
        userLoginData,
        setUserLoginData,
        appointments,
        setAppointments,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        cardInfo,
        setCardInfo,
        lifeCoachBookingList,
        setLifeCoachBookingList,
        generateDates,
        getBookedSlotss,
        getBookedSlots,
        token,
        setToken
    } = useContext(Context);
    const navigate = useNavigate();


    
   
    const [image, setImage] = useState(userLoginData?.img ? `/uploads/${userLoginData.img}` : null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [userInfo, setUserInfo] = useState({
        aliasName: '',
        name: '',
        email: '',
        contact: '',
        gender: '',
        language: '',
        dob: '',
        bookingReason: '',
    });

    const [savedCards, setSavedCards] = useState([]);

    useEffect(() => {
        if (userLoginData) {
            setUserInfo({
                aliasName: userLoginData.aliasName || '',
                name: userLoginData.name || '',
                email: userLoginData.email || '',
                contact: userLoginData.contact || '',
                gender: userLoginData.gender || '',
                language: userLoginData.language || '',
                dob: userLoginData.dob || '',
                img: userLoginData.img || null,
            });
            setImage(userLoginData.img ? userLoginData.img : null);
        }
        else if (appointments.length > 0) {
            const latest = appointments[appointments.length - 1];
            setUserInfo({
                aliasName: latest.aliasName || '',
                name: latest.fullName || '',
                email: latest.email || '',
                contact: latest.phone || '',
                gender: latest.gender || '',
                language: latest.language || '',
                dob: latest.dob || '',
                bookingReason: latest.bookingReason || '',
                slot: latest.timeSlot || '',
            });
        }
    }, [userLoginData, appointments]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
        toast.success("Edit Your UserProfile");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userInfo.name);
        formData.append('aliasName', userInfo.aliasName);
        formData.append('email', userInfo.email);
        formData.append('contact', userInfo.contact);
        formData.append('gender', userInfo.gender);
        formData.append('language', userInfo.language);
        formData.append('dob', userInfo.dob);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const res = await fetch('https://myinnerside.com/api/auth/edit', {
                method: 'PATCH',
                headers: {
                    Authorization: `${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUserLoginData(data.user);
                toast.success('Profile updated');
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancelAppointment = (indexToRemove) => {
        const updated = appointments.filter((_, index) => index !== indexToRemove);
        setAppointments(updated);
        toast.success("Appointment cancelled!");
    };

    const handleCancelAppointments = async (index) => {
        const appointmentId = appointments[index]._id;
        try {
            const response = await axios.post('https://myinnerside.com/api/appointments/cancel', {
                appointmentId: appointmentId
            });
            if (response.data) {
                const updatedAppointments = appointments.filter((_, idx) => idx !== index);
                setAppointments(updatedAppointments);
                toast.success("Appointment cancelled successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment.');
        }
    };


    const handlecancelbooking = async (index) => {
        const appointmentId = lifeCoachBookingList[index]._id;
        try {
            const response = await axios.post('https://myinnerside.com/api/lifecoach/cancel', {
                bookingId: appointmentId
            });
            if (response.data) {
                const updatedLifeCoachList = lifeCoachBookingList.filter((_, idx) => idx !== index);
                setLifeCoachBookingList(updatedLifeCoachList);
                toast.success("Life Coach appointment cancelled successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel Life Coach appointment.');
        }
    };



    const handleRescheduleAppointment = (index) => {
        const selected = appointments[index];
        setRescheduleIndex(index);
        setRescheduleData({
            date: new Date(selected.date),
            slot: selected.slot
        });
        setIsRescheduleOpen(true);
    };

    const handleSaveReschedule = async () => {
        if (rescheduleIndex === null) {
            toast.error('No appointment selected for reschedule.');
            return;
        }

        if (!rescheduleData.slot || !rescheduleData.date) {
            toast.error('Please select both date and slot');
            return;
        }

        const appointmentId = appointments[rescheduleIndex]._id;

        try {
            const response = await axios.post('https://myinnerside.com/api/appointments/reschedule', {
                appointmentId: appointmentId,
                newDate: rescheduleData.date,
                newTimeSlot: rescheduleData.slot
            });

            if (response.data) {
                const updatedAppointments = [...appointments];
                updatedAppointments[rescheduleIndex] = {
                    ...updatedAppointments[rescheduleIndex],
                    date: rescheduleData.date,
                    timeSlot: rescheduleData.slot,
                    isrescheduled: true,
                    rescheduledDate: rescheduleData.date,
                    rescheduledTimeSlot: rescheduleData.slot
                };

                setAppointments(updatedAppointments);
                setIsRescheduleOpen(false);
                toast.success("Appointment rescheduled successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reschedule appointment.');
        }
    };


    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate) return;
            const booked = await getBookedSlotss(selectedDate);
            setBookedSlots(booked);
        };
        fetchSlots();
    }, [selectedDate]);

    const handleLogOut = () => {
        localStorage.removeItem("token");
        setToken('');
        toast.success("Logged Out Successfully!");
        navigate("/login");
    };

    const handleCard = (e) => {
        setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
    };

    const cardSubmit = (e) => {
        e.preventDefault();

        if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
            toast.error("Please fill all fields!");
            return;
        }

        setSavedCards([...savedCards, cardInfo]);
        toast.success("Your card details saved successfully!");
        setCardInfo({
            number: "",
            name: "",
            expiry: "",
            cvv: "",
            isFlipped: false,
        });
    };

    const handaleNavigateapp = (appointmentID) => {
        navigate(`/video-call/${appointmentID}`);
    }

    return (
        <>
            <div className="profile_container">
                <div className="">
                    <div className="profile_section">
                        <div className="aside_left">
                            <h2> <div className="icon">
                                <FaHome size={16} /> </div> Dashboard </h2>
                            <div className='user_icons'>
                                <ul>
                                    <li className={activeTab === 'userInfo' ? 'active' : ''} onClick={() => setActiveTab('userInfo')}>
                                        <HiUsers className='icon' /> User Info
                                    </li>

                                    <li className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
                                        <LuNotebookPen className='icon' /> My Appointment
                                    </li>

                                    <li className={activeTab === 'addPaymentDetail' ? 'active' : ''} onClick={() => setActiveTab('addPaymentDetail')} >
                                        <FaCcMastercard className='icon' /> Add Payment Details
                                    </li>

                                    <li className={activeTab === 'lifeCoachAppointment' ? 'active' : ''} onClick={() => setActiveTab('lifeCoachAppointment')}>
                                        <LuNotebookPen className='icon' /> LifeCoach Appointment
                                    </li>

                                    <li className='logout_btn' onClick={handleLogOut} >
                                        <CgLogOut className='icon' /> Logout
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="profile_information">
                            {activeTab === 'userInfo' && (
                                <div className='profile_form'>
                                    <div className="profile_img">
                                        <div className='image'>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                                id="upload-profile"
                                            />
                                            <label htmlFor="upload-profile" className="upload_profile">
                                                <img
                                                    src={
                                                        image
                                                            ? image.startsWith('data:')
                                                                ? image
                                                                : `https://myinnerside.com${image}`
                                                            : '/default-profile.png'
                                                    }
                                                    alt="userprofile"
                                                    width="100%"
                                                />
                                                <MdAddPhotoAlternate className='icon' />
                                            </label>
                                        </div>

                                        <div className='profile_name'>
                                            <h3>Alious Name: {userInfo.aliasName} </h3>
                                            <h5>Email:{userInfo.email} </h5>
                                        </div>
                                    </div>

                                    <div className="general_profile_info">
                                        <form action="" onSubmit={handleSubmit}>
                                            <div className="form_group  w-50">
                                                <label htmlFor="">
                                                    User Name
                                                </label>
                                                <input type="text" name='name' className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`} value={userInfo.name} disabled={!isEditing} onChange={handleChange} />
                                            </div>
                                            <div className="form_group w-50">
                                                <label> Alias Name</label>
                                                <input type="text" name='aliasName' className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`} value={userInfo.aliasName} onChange={handleChange} disabled={!isEditing} />
                                            </div>
                                            <div className="form_group  w-50">
                                                <label htmlFor="">
                                                    Email
                                                </label>
                                                <input type="email" name='email' className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`} value={userInfo.email} disabled={!isEditing} onChange={handleChange} />
                                            </div>
                                            <div className="form_group  w-50">
                                                <label htmlFor="">
                                                    Number
                                                </label>
                                                <input type="tel" name='contact' pattern="\d{10}" maxLength="10" className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`} value={userInfo.contact} disabled={!isEditing} onChange={handleChange} />
                                            </div>
                                            <div className="form_group w-50">
                                                <label>Gender</label>
                                                <select name="gender" className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`} value={userInfo.gender} disabled={!isEditing} onChange={handleChange} >
                                                    <option value="">Choose Gender </option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="form_group w-50">
                                                <label>D.O.B</label>
                                                <div className="datepicker_wrapper">
                                                    <DatePicker
                                                        name='dob'
                                                        dateFormat="dd/MM/yyyy"
                                                        className={` form_control ${!isEditing ? 'cursor-disabled' : ''}`}
                                                        showMonthDropdown
                                                        required
                                                        selected={userInfo.dob ? new Date(userInfo.dob) : null}
                                                        onChange={(date) => {
                                                            if (isEditing) {
                                                                setUserInfo((prev) => ({ ...prev, dob: date }));
                                                            }
                                                        }}
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        maxDate={new Date()}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </div>

                                            <div className='w-100'>
                                                {
                                                    isEditing ? (
                                                        <button type="button" className="profile_btn" onClick={handleSubmit}>Save Changes</button>
                                                    ) : (
                                                        <button type="button" className="profile_btn" onClick={handleEdit}> Edit Details </button>
                                                    )
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appointments' && (
                                <div className="appointment">
                                    <h2>My Appointments</h2>
                                    

                                    <div className="appointment_grid">
                                        {appointments.length === 0 ? (
                                            <p className='no_appointment'> No appointments yet.</p>
                                        ) : (
                                            <div className='appointment_table'>
                                                <table >
                                                    <thead>
                                                        <tr>
                                                            <th>S no.</th>
                                                            <th>Full Name</th>
                                                            <th>Email</th>
                                                            <th>Contact</th>
                                                            <th>Gender</th>
                                                            <th>Date</th>
                                                            <th>Language</th>
                                                            <th>Reason</th>
                                                            <th>Slot Time</th>
                                                            <th>Join Video Call</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {appointments.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.email}</td>
                                                                <td>{userInfo.contact}</td>
                                                                <td>{item.gender}</td>
                                                                <td>{dayjs(item.date).format("DD MMM YYYY")}</td>
                                                                <td>{item.language}</td>
                                                                <td>{item.bookingReason}</td>
                                                                <td>{item.timeSlot}</td> 
                                                                <td> <button className='video_call_btn' onClick={() => handaleNavigateapp(item._id)} > <FaVideo /> Join Now </button></td>
                                                                <td>
                                                                    <button className="cancel_btn" onClick={() => handleCancelAppointments(index)}>Cancel</button>
                                                                    <button className="reschedule_btn" onClick={() => handleRescheduleAppointment(index)}>Reschedule</button>
                                                                    
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'addPaymentDetail' && (
                                <div className="payment_details">
                                    <div className="payment-container">
                                        <div className={`card-preview ${cardInfo.isFlipped ? "flipped" : ""}`}>
                                            <div className="card front">
                                                <div className="chip" />
                                                <div className="card-number">
                                                    {cardInfo.number.padEnd(16, "•").replace(/(.{4})/g, "$1 ")}
                                                </div>
                                                <div className="card-name-expiry">
                                                    <div className="name">{cardInfo.name || "FULL NAME"}</div>
                                                    <div className="expiry">
                                                        {cardInfo.expiry || "MM/YY"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card back">
                                                <div className="cvv-label">CVV</div>
                                                <div className="cvv-value">{cardInfo.cvv.padEnd(3, "•")}</div>
                                            </div>
                                        </div>

                                        <form className="payment-form" onSubmit={cardSubmit}>
                                            <label> Card Number </label>
                                            <input
                                                type="tel"
                                                name="number"
                                                pattern="\d{16}"
                                                maxLength="16"
                                                required
                                                value={cardInfo.number}
                                                onChange={(e) => {
                                                    const onlyDigits = e.target.value.replace(/\D/g, '');
                                                    if (onlyDigits.length <= 16) {
                                                        handleCard({ target: { name: 'number', value: onlyDigits } });
                                                    }
                                                }}
                                            />

                                            <label>Cardholder Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={cardInfo.name}
                                                onChange={handleCard}
                                            />

                                            <div className="form_row">
                                                <div>
                                                    <label>Expiry Date</label>
                                                    <input
                                                        type="tel"
                                                        name="expiry"
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                        required
                                                        value={cardInfo.expiry}
                                                        onChange={(e) => {
                                                            let value = e.target.value.replace(/[^\d]/g, '');
                                                            if (value.length >= 3) {
                                                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                                            }
                                                            if (value.length <= 5) {
                                                                handleCard({ target: { name: 'expiry', value } });
                                                            }
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label>CVV</label>
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        maxLength="3"
                                                        value={cardInfo.cvv}
                                                        required
                                                        onChange={(e) => {
                                                            const digitsOnly = e.target.value.replace(/\D/g, '');
                                                            handleCard({ target: { name: 'cvv', value: digitsOnly } });
                                                        }}
                                                        onFocus={() => setCardInfo({ ...cardInfo, isFlipped: true })}
                                                        onBlur={() => setCardInfo({ ...cardInfo, isFlipped: false })}
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit">Save Card</button>
                                        </form>
                                    </div>

                                    <div className="card_table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S.no.</th>
                                                    <th> Card Number </th>
                                                    <th> Card Holder Name</th>
                                                    <th>Expiry Date</th>
                                                    <th>CVV</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {savedCards.map((item, id) => (
                                                    <tr key={id}>
                                                        <td>{id + 1}</td>
                                                        <td>{item.number}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.expiry}</td>
                                                        <td>
                                                            <span> {showPassword[id] ? item.cvv : item.cvv.replace(/./g, "*")}   </span>
                                                            <span
                                                                style={{ cursor: "pointer", marginLeft: "8px" }}
                                                                onClick={() => setShowPassword((prev) => ({
                                                                    ...prev,
                                                                    [id]: !prev[id],
                                                                }))}
                                                            >    {showPassword[id] ? <IoMdEyeOff /> : <FaRegEye />} </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'lifeCoachAppointment' && (
                                <div className="appointment">
                                    <h2>Life Coach Appointment </h2>
                                    <div className="appointment_grid">
                                        {lifeCoachBookingList.length === 0 ? (
                                            <p className='no_appointment'> No Appointments Yet. </p>
                                        ) : (
                                            <div className='appointment_table'>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>S no.</th>
                                                            <th>Full Name</th>
                                                            <th>Email</th>
                                                            <th>Contact</th>
                                                            <th>Gender</th>
                                                            <th>Date</th>
                                                            <th>Language</th>
                                                            <th>Reason</th>
                                                            <th>Slot Time</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {lifeCoachBookingList.map((item, index) => (
                                                            <tr key={item._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.email}</td>
                                                                <td>{userInfo.contact}</td>
                                                                <td>{item.gender}</td>
                                                                <td>{dayjs(item.date).format("DD MMM YYYY")}</td>
                                                                <td>{item.language}</td>
                                                                <td>{item.bookingReason}</td>
                                                                <td>{item.slot}</td>
                                                                <td>
                                                                    <button className="cancel_btn" onClick={() => handlecancelbooking(index)}>Cancel</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


            {isRescheduleOpen && (
                <div className="reshedule_container">
                    <div className="reshedule_popup">
                        <div className='col-half'>
                            <h3>Reschedule Appointment</h3>
                            <label htmlFor=""> Choose Date </label>
                            <div className="date-grid">
                                {generateDates().map((date, index) => (
                                    <div
                                        key={index}
                                        className={`date-box ${dayjs(date).isSame(rescheduleData.date, 'day') ? 'active' : ''}`}
                                        onClick={() => {
                                            setRescheduleData(prev => ({ ...prev, date }));
                                            // Refresh booked slots when date changes
                                            getBookedSlotss(date).then(booked => setBookedSlots(booked));
                                        }}
                                    >
                                        <div className="weekday">{dayjs(date).format('ddd')}</div>
                                        <div className="day">{dayjs(date).format('D')}</div>
                                        <div className="month">{dayjs(date).format('MMM')}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='col-half reschedule_rightside'>
                            <label htmlFor=""> Slot Time </label>
                            <div className="slot-grid">
                                {timeSlots.map((slot, index) => {
                                    const isBooked = bookedSlots.includes(slot);
                                    const isTimeOver = isSlotOver(slot, rescheduleData.date);
                                    const isDisabled = isBooked || isTimeOver;

                                    return (
                                        <div
                                            key={index}
                                            className={`slot-box ${rescheduleData.slot === slot ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                                            onClick={() => !isDisabled && setRescheduleData(prev => ({ ...prev, slot }))}
                                        >
                                            <div className='timing'> {slot} </div>
                                            <div className="status">
                                                {isBooked ? 'Booked' : isTimeOver ? 'Time Over' : 'Available'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="modal_buttons">
                                <button className="reschedule_btn" onClick={handleSaveReschedule}>Save</button>
                                <button className="cancel_btn" onClick={() => setIsRescheduleOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyProfile;