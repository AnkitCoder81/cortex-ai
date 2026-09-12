import mongoose from "mongoose";

//Authentication Schema
const userSchema=new mongoose.Schema({
          firebaseUid:{   // authentication is done by firebase so we will use firebase uid as unique identifier for user
               type:String,
               unique:true,
          },
          name:String,
          email:String,
          avatar:String,
          plan:{
               type:String,
               default:"free"
          },
          credits:{
               type:Number,
               default:100
          },
          totalCredits:{
               type:Number,
               default:100
          },
          planExpiresAt:Date
},{
          timestamps:true
})

const User=mongoose.model("User",userSchema);
export default User;
