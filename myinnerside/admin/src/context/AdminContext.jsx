import  { createContext, useState } from 'react';
import dayjs from "dayjs";
import axios from 'axios';




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

export const AdminContext = createContext();



const AdminContextProvider = (props ) => {



    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
     const backendUrl= import.meta.env.VITE_BACKEND_URL
     const [selectedDate, setSelectedDate] = useState(generateDates()[0]);
     const [selectedSlot, setSelectedSlot] = useState(null);


      const getBookedSlotss = async (selectedDate) => {
      try {
        const response = await fetch(`https://myinnerside.com/api/appointments/booked-slots`, {
          method: 'GET',
        
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

     const getDisabledSlots = async (date) => {
    const res = await axios.get(`https://myinnerside.com/api/slots?date=${date}`);
    return res.data.disabled;
  };

  const toggleSlotAvailability = async (date, slot) => {
    await axios.post('https://myinnerside.com/api/slots/toggle', { date, slot });
  };


    const value={
        aToken, setAToken,backendUrl,getBookedSlotss,generateDates,selectedDate,setSelectedDate,    selectedSlot,
    setSelectedSlot,getDisabledSlots,toggleSlotAvailability
    }



   


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
}
export default AdminContextProvider;

