import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type : String, required: true },
  // aliasName:  { type : String, required: true },
  aliasName: { type: String, default: '' },
  img : { type : String, default : null },
  email:  { type : String, required: true },
  contact:  { type : String, required: true },
  dob: { type : String, required: true },
  gender: { type : String, required: true },
  password: { type : String, required: true },
   resetPasswordToken: String,
   resetPasswordExpire: Date,
  created_at: { type: Date, default: Date.now }
});

const userModel=mongoose.models.user || mongoose.model('user',userSchema); 
export default userModel;
