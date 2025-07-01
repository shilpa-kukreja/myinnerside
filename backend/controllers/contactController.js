import contactModel from "../models/contactModel.js";





export const contactmessage= async (req, res) => {
  try {
    const { firstName, lastName, email, number, message } = req.body;

    if (!firstName || !lastName || !email || !number) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const newMessage = new contactModel({ firstName, lastName, email, number, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};



// Get all contacts (for admin)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true,
      contacts 
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch contacts"
    });
  }
};

// Delete contact (for admin)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await contactModel.findByIdAndDelete(id);
    
    res.status(200).json({ 
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete contact"
    });
  }
};


