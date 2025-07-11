
import Appointment from "../models/appointmentModel.js";
import crypto from 'crypto';
import dotenv from 'dotenv';
import appointmentModel from "../models/appointmentModel.js";
import nodemailer from 'nodemailer';
dotenv.config();


const validCoupons = {
  SAVE20: 20,
  FIRST50: 50,
};

const originalPrice = 499;

export const bookAppointment = async (req, res) => {
  try {
     const userId = req.userId;
    const {
     phone, language, bookingReason,
      hideIdentity, usePreviousDetails,
      date, timeSlot, couponCode,name,gender, email,cameraoption,genderoption
    } = req.body;

    if (!date || !timeSlot || !language || !bookingReason) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const discount = validCoupons[couponCode?.toUpperCase()] || 0;
    const finalPrice = originalPrice - discount;

    const existing = await Appointment.findOne({ date, timeSlot });
    if (existing) return res.status(400).json({ message: "Slot already booked." });

    const appointment = await Appointment.create({
      userId, phone, language, bookingReason,
      hideIdentity, usePreviousDetails,
      date, timeSlot, couponCode, discount,
      price: finalPrice,name,gender, email,cameraoption,genderoption
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const userId = req.userId;
     const appointments = await Appointment.find({userId});
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No booked slots found." });
      }
    res.status(200).json({success: true, appointments });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





const generateAppointmentEmailHTML = (appointment) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #4A90E2;">🎉 Appointment Confirmed!</h2>
      <p>Hi <strong>${appointment.name}</strong>,</p>
      <p>Thank you for booking your session. Here are your details:</p>
      <ul>
        <li><strong>Date:</strong> ${appointment.date}</li>
        <li><strong>Time Slot:</strong> ${appointment.timeSlot}</li>
        <li><strong>Language:</strong> ${appointment.language}</li>
        <li><strong>Reason:</strong> ${appointment.bookingReason}</li>
        <li><strong>Gender Preference:</strong> ${appointment.genderoption}</li>
        <li><strong>Camera Preference:</strong> ${appointment.cameraoption}</li>
      </ul>
      <p>We look forward to seeing you!</p>
      <br/>
      <p style="font-size: 0.9rem; color: #999;">– MyInnerSide Team</p>
    </div>
  `;
};


const sendAppointmentEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MyInnerSide" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const verifyPaymentAndBook = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentDetails,
    } = req.body;

    appointmentDetails.userId = userId;

    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment details' });
    }

    
    const requiredFields = [
      'userId', 'name', 'email', 'gender', 'phone', 'language',
      'bookingReason', 'date', 'timeSlot', 'price', 'cameraoption', 'genderoption'
    ];
    for (const field of requiredFields) {
      if (!appointmentDetails[field]) {
        return res.status(400).json({ message: `Missing field in appointmentDetails: ${field}` });
      }
    }

   
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    
    const appointment = await Appointment.create({ ...appointmentDetails });

    
    const htmlContent = generateAppointmentEmailHTML(appointment);
    await sendAppointmentEmail(appointment.email, "✅ Your Appointment is Confirmed", htmlContent);

    
    const adminEmail = process.env.ADMIN_EMAIL || "admin@myinnerside.com";
    await sendAppointmentEmail(adminEmail, `📥 New Appointment Booked - ${appointment.name}`, htmlContent);

    res.status(201).json({
      message: '✅ Payment verified and appointment booked',
      appointment,
    });
  } catch (err) {
    console.error('❌ Server Error:', err.message);
    res.status(500).json({
      message: 'Server error during payment verification',
      error: err.message,
    });
  }
};




// export const verifyPaymentAndBook = async (req, res) => {
//   try {
//      const userId = req.userId;
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       appointmentDetails,
//     } = req.body;

     
//     appointmentDetails.userId = userId;

//     // Debug logs
//     console.log('🧾 Request Body:', req.body);
//     console.log('🔑 RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

//     // Validate required Razorpay fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ message: 'Missing Razorpay payment details' });
//     }

//     // Validate required appointment fields
//     const requiredFields = [
//       'userId', 'name', 'email', 'gender', 'phone', 'language',
//       'bookingReason', 'date', 'timeSlot', 'price','cameraoption', 'genderoption'
//     ];
//     for (const field of requiredFields) {
//       if (!appointmentDetails[field]) {
//         return res.status(400).json({ message: `Missing field in appointmentDetails: ${field}` });
//       }
//     }


//     // Generate signature
//     const generatedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest('hex');

//     console.log('🔐 Generated Signature:', generatedSignature);
//     console.log('🔏 Received Signature:', razorpay_signature);

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: 'Payment verification failed' });
//     }

//     // Create appointment
//     try {
//       const appointment = await Appointment.create({ ...appointmentDetails });
//       return res.status(201).json({
//         message: '✅ Payment verified and appointment booked',
//         appointment,
//       });
//     } catch (createErr) {
//       console.error('❌ Error creating appointment:', createErr.message);
//       return res.status(500).json({
//         message: 'Failed to create appointment',
//         error: createErr.message,
//       });
//     }

//   } catch (err) {
//     console.error('❌ Server Error:', err.message);
//     res.status(500).json({
//       message: 'Server error during payment verification',
//       error: err.message,
//     });
//   }
// };


export const resduleAppointment = async (req, res) => {
  try {
    const { appointmentId, newDate, newTimeSlot } = req.body;

    if (!appointmentId || !newDate || !newTimeSlot) {
      return res.status(400).json({ message: "All fields must be filled." });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.isrescheduled) {
      return res.status(400).json({ message: "Appointment already rescheduled." });
    }

    const existing = await Appointment.findOne({ date: newDate, timeSlot: newTimeSlot });
    if (existing) {
      return res.status(400).json({ message: "New slot already booked." });
    }

    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    appointment.isrescheduled = true;
    appointment.rescheduledDate = newDate;
    appointment.rescheduledTimeSlot = newTimeSlot;

    await appointment.save();

    res.status(200).json({ message: "Appointment rescheduled successfully.", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    if (appointment.isrescheduled) {
      return res.status(400).json({ message: "Cannot cancel a rescheduled appointment." });
    } 
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: "Appointment cancelled successfully." });
  }
  catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}








// export const getAllapppointments= async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search = '' } = req.query;
    
//     const query = {
//       $or: [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { bookingReason: { $regex: search, $options: 'i' } }
//       ]
//     };

//     const appointments = await appointmentModel.find(query)
//       .populate('userId', 'name email')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const count = await appointmentModel.countDocuments(query);

//     res.json({
//       appointments,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       totalAppointments: count
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };


// export const removeappointment= async (req, res) => {
//   try {
//     const appointment = await appointmentModel.findById(req.params.id);
    
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     await appointment.remove();
//     res.json({ message: 'Appointment removed' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };



export const getAllapppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookingReason: { $regex: search, $options: 'i' } }
      ]
    };

    const appointments = await appointmentModel.find(query)
      .populate('userId', 'name email')
      .populate('assignedTeamMember', 'name email number') 
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await appointmentModel.countDocuments(query);

    res.json({
      appointments,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalAppointments: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



export const removeappointment = async (req, res) => {
  try {
    const appointment = await appointmentModel.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointmentModel.findByIdAndDelete(req.params.id); 
    res.status(200).json({ message: 'Appointment removed successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}





// Get appointments assigned to the logged-in team member
export const getMyAssignedAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const query = { assignedTeamMember: req.user._id };
    
    const totalAppointments = await appointmentModel.countDocuments(query);
    const totalPages = Math.ceil(totalAppointments / limit);
    
    const appointments = await appointmentModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: 1, timeSlot: 1 }); // Sort by date and time
    
    res.status(200).json({
      success: true,
      appointments,
      totalPages,
      totalAppointments
    });
  } catch (error) {
    console.error("Error fetching assigned appointments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Assign team member to appointment
export const assignTeamMember = async (req, res) => {
  try {
    const { teamMemberId } = req.body;
    
    const update = teamMemberId 
      ? { assignedTeamMember: teamMemberId }
      : { $unset: { assignedTeamMember: 1 } };
    
    const appointment = await appointmentModel.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('assignedTeamMember', 'name email number');
    
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      appointment,
      message: teamMemberId ? 'Team member assigned successfully' : 'Assignment removed successfully'
    });
  } catch (error) {
    console.error("Error assigning team member:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};






