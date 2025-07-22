import AdminslotModel from "../models/AdminslotModel.js";


export const getBookedSlots = async (req, res) => {
  const { date } = req.query;
  try {
    const slots = await AdminslotModel.find({ date });
    const booked = slots.filter(s => s.status === 'booked').map(s => s.slot);
    const disabled = slots.filter(s => s.status === 'disabled').map(s => s.slot);
    res.json({ booked, disabled });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slots' });
  }
};

export const toggleSlotAvailability = async (req, res) => {
  const { date, slot } = req.body;

  try {
    const existingSlot = await AdminslotModel.findOne({ date, slot });

    if (existingSlot) {
      // Toggle status
      existingSlot.status = existingSlot.status === 'disabled' ? 'available' : 'disabled';
      await existingSlot.save();
    } else {
      // Create a new disabled slot
      await AdminslotModel.create({ date, slot, status: 'disabled' });
    }

    res.json({ message: 'Slot updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle slot' });
  }
};



export const getBookedAdminSlots = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    // Format the date to match your database format (YYYY-MM-DD)
    const startOfTomorrow = new Date(today);
    startOfTomorrow.setDate(today.getDate() );
    const startOfTomorrowStr = startOfTomorrow.toISOString().split('T')[0];

    console.log("Start of Tomorrow (string):", startOfTomorrowStr);

    const bookedSlots = await AdminslotModel.find(
      {
        date: { $gte: startOfTomorrowStr } // Compare as strings
      },
      {
        slot: 1,
        date: 1,
        _id: 0
      }
    );

    const slots = bookedSlots.map(appointment => ({
      timeSlot: appointment.slot,
      date: appointment.date
    }));

    console.log("Booked Slots:", slots);

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
