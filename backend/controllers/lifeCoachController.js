import dayjs from 'dayjs';
import lifeCoshModel from '../models/lifeCoachModel.js';

export const addBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { number,name,gender, email, language, bookingReason, date, slot } = req.body;

    if (!number || !language || !bookingReason || !date || !slot) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // prevent double booking
    const existing = await lifeCoshModel.findOne({ date, slot });
    if (existing) {
      return res.status(409).json({ error: "Slot already booked." });
    }

    const newBooking = await lifeCoshModel.create({  userId,number,name,gender, email, language, bookingReason, date, slot });
    res.status(201).json({ message: "Booking successful", booking: newBooking });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const userId = req.userId;
   

    const slots = await lifeCoshModel.find({userId});
    if (!slots || slots.length === 0) {
      return res.status(404).json({ error: "No booked slots found." });
    }
   res.status(200).json({ success: true, lifeCoachBookingList: slots });
  } catch (err) {
    res.status(500).json({ error: "Error fetching slots" });
  }
};



export const getBookedlifeSlots = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    console.log("Start of Tomorrow (Date):", tomorrow.toISOString());

    const bookedSlots = await lifeCoshModel.find(
      {
        date: { $gte: tomorrow }  // <-- Query using Date object, not string
      },
      {
        slot: 1,
        date: 1,
        _id: 0
      }
    );

    const slots = bookedSlots.map(appointment => ({
      timeSlot: appointment.slot,
      date: appointment.date.toISOString().split('T')[0] 
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
}

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required." });
    }

    const booking = await lifeCoshModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    await lifeCoshModel.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking cancelled successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}








export const lifeCoachappointmentlist= async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { number: { $regex: search, $options: 'i' } },
        { bookingReason: { $regex: search, $options: 'i' } }
      ]
    };

    const appointments = await lifeCoshModel.find(query)
      .populate('userId', 'name email')
      .sort({ date: 1 }) // Sort by appointment date
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await lifeCoshModel.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalAppointments: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeliofecoach= async (req, res) => {
  try {
    const appointment = await lifeCoshModel.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.remove();
    res.json({ message: 'Appointment removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};




