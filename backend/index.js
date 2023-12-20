import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
dotenv.config();

mongoose.connect(process.env.MongoDB).then(() =>{console.log("MongoDB connected")}).catch((err) =>{console.log(err)});
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8070 ; 

app.listen(PORT,() =>{
    console.log(`Server is up and running on port ${PORT}`);
});

app.use("/backend/auth", authRoutes);