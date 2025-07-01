import appointmentModel from "../models/appointmentModel.js";


export const getBookedSlots = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    // Format the date to match your database format (YYYY-MM-DD)
    const startOfTomorrow = new Date(today);
    startOfTomorrow.setDate(today.getDate() + 1);
    const startOfTomorrowStr = startOfTomorrow.toISOString().split('T')[0];

    console.log("Start of Tomorrow (string):", startOfTomorrowStr);

    const bookedSlots = await appointmentModel.find(
      {
        date: { $gte: startOfTomorrowStr } // Compare as strings
      },
      {
        timeSlot: 1,
        date: 1,
        _id: 0
      }
    );

    const slots = bookedSlots.map(appointment => ({
      timeSlot: appointment.timeSlot,
      date: appointment.date
    }));

    res.status(200).json({
      success: true,
      data: slots
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};



export const getAppointmentDateTime = async (req, res) => {
  try {
    const data = await appointmentModel.find(
      {}, 
      { date: 1, timeSlot: 1, _id: 0 }
    );
    
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
};