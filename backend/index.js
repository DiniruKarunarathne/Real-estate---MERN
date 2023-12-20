import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MongoDB).then(() =>{console.log("MongoDB connected")}).catch((err) =>{console.log(err)});
const app = express();

const PORT = process.env.PORT || 8070 ; 

app.listen(PORT,() =>{
    console.log(`Server is up and running on port ${PORT}`);
});