import cardModel from "../models/cardModel.js";

// Save a new card
export const saveCard = async (req, res) => {
  try {
    const { number, name, expiry, cvv } = req.body;

    if (!number || !name || !expiry || !cvv) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newCard = new cardModel({ number, name, expiry, cvv });
    await newCard.save();
    res.status(201).json({ message: 'Card saved successfully', card: newCard });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all saved cards
export const getCards = async (req, res) => {
  try {
    const cards = await cardModel.find().sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
