import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MongoDB).then(() =>{console.log("MongoDB connected")}).catch((err) =>{console.log(err)});
const app = express();

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 8070 ; //set port

app.listen(PORT,() =>{
    console.log(`Server is up and running on port ${PORT}`);
});

app.use("/backend/auth", authRoutes);

app.use("/backend/user", userRouter); // Assuming userRoutes is imported


app.use((err , req , res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({success: false ,statusCode, message});
})