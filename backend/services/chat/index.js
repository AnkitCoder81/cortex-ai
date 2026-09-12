import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";


dotenv.config();

const port = process.env.PORT

const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/",router)
app.get("/",(req,res)=>{
          res.json({message:"Hello from chat"});
})

app.listen(port,()=>{
    console.log(`chat started at ${port}`);
    connectDb();
})




