import mongoose from "mongoose";


const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    number: { type: String, required: true },
    message: { type: String, required: true },
    }, { timestamps: true });
const contactModel = mongoose.models.contact || mongoose.model('contact', contactSchema);
export default contactModel;