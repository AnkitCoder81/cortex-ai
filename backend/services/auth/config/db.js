import mongoose from "mongoose";
const connectDb=async()=>{
    try{
      await mongoose.connect(process.env.MONGODB_URI); 
      console.log("db conncted");
    }
    catch(error){
        console.error(`db error ${error}`);
    }
}

export default connectDb;