import mongoose from "mongoose";


const cardSchema = new mongoose.Schema({
  number: { type: String, required: true ,unique: true},
  name: { type: String, required: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
}, { timestamps: true });
const cardModel = mongoose.models.card || mongoose.model('card', cardSchema);
export default cardModel;