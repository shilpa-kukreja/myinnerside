import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';  
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';




export const register = async (req, res) => {

    const {email , password,  name , aliasName, contact, dob, gender } = req.body;
   
    try{
        const userexist = await UserModel.findOne({email});
        if(userexist){
            return res.status(400).json({message : "User already exist"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({email , password : hashedPassword , name , aliasName, contact, dob, gender });
        const saveUser = await user.save();
        const token = jwt.sign({userId : saveUser._id}, process.env.JWT_SECRET, { expiresIn : '7d'});
        res.status(201).json({token : token, user});

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try{
        const userexist = await UserModel.findOne({email});
        if(!userexist){
            return res.status(400).json({message : "User does not exist"});
        } 
        const isValidPassword = await bcrypt.compare(password, userexist.password);
        if(!isValidPassword){
            return res.status(400).json({message : "Invalid password"});
        } 
        const token = jwt.sign({userId : userexist._id}, process.env.JWT_SECRET, { expiresIn : '7d'});
        res.status(200).json({token : token, user : userexist});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const forgotPassword=async(req,res)=>{
    const {email} = req.body;
  try {
     const user=await UserModel.findOne({email});
     if (!user) {
        return res.status(404).json({message:"User not found"})
     }
       const resetToken = crypto
       .randomBytes(20).toString('hex');
          user.resetPasswordToken = resetToken;
          user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
      
          await user.save();

          const resetUrl = `https://myinnerside.com/reset-password/${resetToken}`;
          const message = `You are receiving this email because you (or someone else) has requested a password reset. Please click the link to reset your password: \n\n ${resetUrl}`;

          await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
          });
         res.status(201).json({message:"Email Sent"})
  } catch (error) {
      console.log(error);
      res.status(500).json({message:"Something went wrong"});
  }
}




//api for reset password

export const resetPassword=async(req,res)=>{
    const {token}=req.params;
    const {password}=req.body;
    try {
        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
          }); 
          if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
          }

          user.password = await bcrypt.hash(password, 10);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
      
          await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something Went Wrong"})
    }
}

// edit user profile api

export const editUser = async (req, res) => {
  try {
    const { aliasName, name, email, contact, gender, language, dob } = req.body;
    const userId = req.userId;
    console.log(userId)

    const updateData = {
      aliasName,
      name,
      email,
      contact,
      gender,
      language,
      dob,
    };

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updateData.img = imageUrl;
    }

    

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
   console.log(updatedUser)
    res.status(200).json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await UserModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



export const getallUser= async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { aliasName: { $regex: search, $options: 'i' } }
      ]
    };

    const users = await UserModel.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire') 
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await UserModel.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const removeUser= async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await UserModel.findByIdAndDelete(req.params.id); 
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};













