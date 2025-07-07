import React, { createContext, useState } from "react";
import { Testimonials } from "../assets/assets";
import { useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";

const generateDates = () => {
  const today = new Date();
  const dates = [];

  for (let i = 0; i < 15; i++) {
    const newDate = new Date();
    newDate.setDate(today.getDate() + i);

    // Format to YYYY-MM-DD
    const formattedDate = newDate.toISOString().split('T')[0];

    dates.push(formattedDate);
  }

  return dates;
};



export const Context = createContext();

const CreateContextProvider = (props) => {


  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(generateDates()[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  //  card information
  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    isFlipped: false,
  })

  // console.log(cardInfo)


  // In CreateContext.js or your context provider
  const [lifeCoachBooking, setLifeCoachBooking] = useState({
    date: generateDates()[0],
    slot: null,
    number: '',
    language: '',
    bookingReason: ''
  });

  const [bookedSlots, setBookedSlots] = useState([]);


   const [lifeCoachBookingList,setLifeCoachBookingList]=useState([])
    
   const addLifeCoachBooking = async (newBooking) => {
  try {
    const res = await fetch('https://myinnerside.com/api/lifecoach/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'  ,Authorization: `${token}`,},
      body: JSON.stringify(newBooking),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || 'Booking failed');
      return;
    }

    // Add new booking to local list
    setLifeCoachBookingList(prev => [...prev, data.booking]);

    toast.success('Life coach session booked!');
  } catch (error) {
    console.error('Booking error:', error);
    toast.error('Server error');
  }
};


  // console.log("check life coach data :", lifeCoachBookingList)


  const [formData, setFormData] = useState({
    phone: '',
    language: '',
    bookingReason: [],
    cameraoption:'',
    genderoption:'',
    couponCode: '',
    hideIdentity: false,
    usePreviousDetails: false,
  });


  const [userLoginData, setUserLoginData] = useState({})
   const [token, setToken] = useState("");
   console.log(userLoginData)
  // console.log(formData)


  const [appointments, setAppointments] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(1000); // or whatever your base price is
  const [finalPrice, setFinalPrice] = useState(originalPrice);
  




  const userInfo = () => {
    const newAppointment = {

      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      couponCode: formData.couponCode,
      gender: formData.gender,
      language: formData.language,
      bookingReason: formData.bookingReason,
      hideIdentity: formData.hideIdentity,
      usePreviousDetails: formData.usePreviousDetails,
      date: selectedDate,
      slot: selectedSlot,


    };
    setAppointments(prev => [...prev, newAppointment]);

  };


 const getBookedSlots = (date) => {
  if (!Array.isArray(appointments)) {
    console.warn("appointments is not an array", appointments);
    return [];
  }

  return appointments
    .filter(app => dayjs(app.date).isSame(date, 'day'))
    .map(app => app.slot);
};


  //   life session form details

  //  code for discount 

  useEffect(() => {
  const storedToken = localStorage.getItem("token");

  if (!token && storedToken) {
    setToken(storedToken);
    console.log("Token from localStorage:", storedToken);

    axios.post(
      "https://myinnerside.com/api/auth/user",
      {}, // Empty body
      {
        headers: {
          Authorization: `${storedToken}`, // ✅ Correct header with Bearer
        },
      }
    )
      .then((response) => {
        setUserLoginData(response.data.user);
        console.log("User data:", response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }
}, [token]);


useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    setToken(storedToken);
  }

  if (selectedDate && storedToken) {
    console.log("Token from localStorage:", storedToken);
    console.log("Selected Date:", selectedDate);

    axios
      .post(
        "https://myinnerside.com/api/lifecoach/slots",
        { selectedDate }, // Send if your backend expects date filter
        {
          headers: {
            Authorization: `${storedToken}`,
          },
        }
      )
      .then((response) => {
        if (response.data && Array.isArray(response.data.lifeCoachBookingList)) {
          setLifeCoachBookingList(response.data.lifeCoachBookingList);
        } else {
          console.error("Unexpected response format", response.data);
          setLifeCoachBookingList([]); 
        }
        console.log("Booked lifecoach Slots:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching booked slots:", error);
      });
  }
}, [selectedDate]); // <- Run when selectedDate changes





useEffect(() => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    setToken(storedToken);
  }

  console.log("Token from localStorage:", storedToken);
  console.log("Selected Date:", selectedDate);

  if (selectedDate) {
    axios
      .post(
        "https://myinnerside.com/api/appointments/booked-slots",
        {},
        {
          headers: {
            Authorization: `${storedToken}`,
          },
        }
      )
      .then((response) => {
        // Fix: Assign only the appointments array
        if (response.data && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
        } else {
          console.error("Unexpected response format", response.data);
          setAppointments([]); // fallback
        }
        console.log("Booked Slots:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching booked slots:", error);
      });
  }
}, []);




   
//  const [ discount,setDiscount]= useState(0)
//   const originalPrice=1000;
//    const validCoupon={
//      DISCOUNT100:100,
//     SAVE50:50
//    }



const getBookedSlotss = async (selectedDate) => {
  try {
    const response = await fetch(`https://myinnerside.com/api/appointments/booked-slots`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      // ✅ Filter only booked slots for the selectedDate
      const selectedDay = dayjs(selectedDate).format("YYYY-MM-DD");
      const filtered = data.data.filter(
        (slot) => dayjs(slot.date).format("YYYY-MM-DD") === selectedDay
      ).map((s) => s.timeSlot);
   
      return filtered;
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching booked slots:", error);
    return [];
  }
};




const getBookedSlotsss = async (selectedDate) => {
  try {
    const response = await fetch(`https://myinnerside.com/api/booked-slots`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await response.json();
    if (data.success) {
      // ✅ Filter only booked slots for the selectedDate
      const selectedDay = dayjs(selectedDate).format("YYYY-MM-DD");


      const filtered = data.data.filter(
        (slot) => dayjs(slot.date).format("YYYY-MM-DD") == selectedDay
      ).map((s) => s.timeSlot);


      
      return filtered;
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching booked slots:", error);
    return [];
  }
};


useEffect(() => {
  const fetchSlots = async () => {
    if (!selectedDate) {
      console.warn("❌ selectedDate is not set");
      return;
    }

    const booked = await getBookedSlotss(selectedDate);
    
    const adminbooked = await getBookedSlotsss(selectedDate);

    console.log("📅 Booked Slots:", adminbooked);

    setBookedSlots(booked, ...adminbooked);
  };

  fetchSlots();
}, [selectedDate]); 



 




const getBookedlifecoachSlotss = async () => {
  try {
    const response = await fetch(`https://myinnerside.com/api/lifecoach/lifecoachslot/bookedcoach-slots`, {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      },
    });

    const data = await response.json();

    console.log("📅 Response Data:", data);

    if (data.success) {
      // Return all booked slots (with date and slot info)
      const allBooked = data.data.map((s) => ({
        date: dayjs(s.date).format("YYYY-MM-DD"),
        slot: s.timeSlot,
      }));

      // Debug logs
      console.log("📅 All Booked Slots:", allBooked);

      return allBooked;
    } else {
      console.warn("⚠️ API call succeeded but success flag is false:", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching booked slots:", error);
    return [];
  }
};



useEffect(() => {
  const fetchSlots = async () => {
    const allBooked = await getBookedlifecoachSlotss();
    setBookedSlots(allBooked); 
  };

  fetchSlots();
}, []);







 




  





    
    
    // const finalPrice= originalPrice-discount






  const value = {

    generateDates,
    Testimonials,
    showAppointmentForm,
    setShowAppointmentForm,
    getBookedlifecoachSlotss,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    getBookedSlotss,
    discount, setDiscount,
    //Sign up data
    formData,
    setFormData,
    getBookedSlotsss,
    token,
    setToken,
    getBookedSlots,
    finalPrice, setFinalPrice, originalPrice, setOriginalPrice,

    //Appointment data
    appointments,
    setAppointments,
    userInfo,
    userLoginData,
    setUserLoginData,

    //Card details
    cardInfo,
    setCardInfo,

    //Session
    lifeCoachBooking,
    setLifeCoachBooking,

    //couponcode 
    // discount,
    // setDiscount,
    // validCoupon,
    // finalPrice,
    originalPrice,


    //  lifecoach 
    lifeCoachBookingList,
    setLifeCoachBookingList,
    addLifeCoachBooking,
     



  };

  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
};

export default CreateContextProvider;
