import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
   name:{type:String,required:true},
   aliasname:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true},
   image:{type:String,required:true},
   number:{type:String,required:true},
   permission:{type:String,default:"true"},
   userRole:{type:String,default:"team"},
   dob:{type:String,required:true},
   gender:{type:String,required:true},
},
{
  timestamps: true,
});
const teamModel = mongoose.models.Team || mongoose.model("Team", teamSchema);
export default teamModel;



