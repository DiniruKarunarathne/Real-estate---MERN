import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

mongoose.connect(process.env.MongoDB).then(() =>{console.log("MongoDB connected")}).catch((err) =>{console.log(err)});
const app = express();

app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use(cookieParser());  // To parse the incoming cookies

const PORT = process.env.PORT || 8070 ; //set port

app.listen(PORT,() =>{
    console.log(`Server is up and running on port ${PORT}`);
});

app.use("/backend/auth", authRoutes);

app.use("/backend/user", userRouter); // Assuming userRoutes is imported

app.use('/backend/listing', listingRouter);


app.use((err , req , res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({success: false ,statusCode, message});
})